import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGraph, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import * as THREE from 'three';

// --- 1. VISUAL MAPPING (AZURE ID -> ARKIT SHAPES) ---
// This maps the sound to the specific ARKit muscles
const VISEME_MAP_ARKIT = {
    0: {}, // Silence
    1: { jawOpen: 0.4 }, // aa
    2: { jawOpen: 0.5 }, // aa
    3: { jawOpen: 0.3, mouthFunnel: 0.4 }, // O
    4: { jawOpen: 0.2, mouthSmileLeft: 0.2, mouthSmileRight: 0.2 }, // E (slight smile)
    5: { jawOpen: 0.1, mouthPucker: 0.4 }, // RR
    6: { jawOpen: 0.1, mouthSmileLeft: 0.3, mouthSmileRight: 0.3 }, // I
    7: { mouthPucker: 0.7 }, // U
    8: { jawOpen: 0.3, mouthFunnel: 0.4 }, // O
    9: { jawOpen: 0.4 }, // aa
    10: { jawOpen: 0.3, mouthFunnel: 0.4 }, // O
    11: { jawOpen: 0.4 }, // aa
    12: { jawOpen: 0.1 }, // nn
    13: { jawOpen: 0.1, mouthPucker: 0.4 }, // RR
    14: { jawOpen: 0.1 }, // nn
    15: { jawOpen: 0.1 }, // nn
    16: { jawOpen: 0.1 }, // nn
    17: { jawOpen: 0.1 }, // TH
    18: { mouthPucker: 0.3, mouthRollUpper: 0.2 }, // FF
    19: { jawOpen: 0.1 }, // DD
    20: { jawOpen: 0.2 }, // kk
    21: { mouthPucker: 0.4 } // PP
};

// --- 2. EMOTION RECIPES (ARKIT SPECIFIC) ---
// Note: We split smiles into Left/Right because that's how ARKit works
const EXPRESSIONS = {
    neutral: {
        browInnerUp: 0.0,
        mouthSmileLeft: 0.0, mouthSmileRight: 0.0
    },
    happy: {
        browInnerUp: 0.3,
        eyeSquintLeft: 0.2, eyeSquintRight: 0.2,
        mouthSmileLeft: 0.6, mouthSmileRight: 0.6,
        cheekPuff: 0.1
    },
    sad: {
        browDownLeft: 0.5, browDownRight: 0.5,
        mouthFrownLeft: 0.6, mouthFrownRight: 0.6,
        eyeLookDownLeft: 0.2, eyeLookDownRight: 0.2
    },
    surprised: {
        browInnerUp: 0.8,
        eyeWideLeft: 0.6, eyeWideRight: 0.6,
        jawOpen: 0.1 // Slight mouth open
    },
    angry: {
        browDownLeft: 0.8, browDownRight: 0.8,
        noseSneerLeft: 0.5, noseSneerRight: 0.5,
        eyeSquintLeft: 0.5, eyeSquintRight: 0.5
    }
};

export function Model({ textToSpeak, emotion = "neutral", ...props }) {
    const { scene } = useGLTF('/avatar.glb');
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    // --- REFS & STATE ---
    const audioPlayer = useRef(new Audio());
    const visemeData = useRef([]);
    const synthesizerRef = useRef(null);
    const headMeshRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // --- 3. AUTO-DETECT HEAD MESH ---
    useEffect(() => {
        let foundHead = null;
        clone.traverse((child) => {
            // Find the mesh with morph targets (Face)
            if (child.isMesh && child.morphTargetDictionary && Object.keys(child.morphTargetDictionary).length > 0) {
                // Prefer one named "Wolf3D_Head" or similar
                if (!foundHead || child.name.includes("Head") || child.name.includes("Avatar")) {
                    foundHead = child;
                }
            }
        });
        if (foundHead) {
            headMeshRef.current = foundHead;
            console.log("✅ ARKit Head Mesh Configured:", foundHead.name);
        }
    }, [clone]);

    // --- 4. SAFE AUDIO GENERATION (Crash Proof) ---
    useEffect(() => {
        let isMounted = true;

        // STOP previous audio
        audioPlayer.current.pause();
        audioPlayer.current.currentTime = 0;
        setIsPlaying(false);

        if (synthesizerRef.current) {
            const oldSynth = synthesizerRef.current;
            synthesizerRef.current = null; // Clear ref first
            try { oldSynth.close(); } catch (e) { /* Already disposed, ignore */ }
        }

        if (!textToSpeak) return;

        // AZURE CONFIG
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
            import.meta.env.VITE_AZURE_KEY,
            import.meta.env.VITE_AZURE_REGION
        );
        speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

        const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, null);
        synthesizerRef.current = synthesizer;
        visemeData.current = [];

        // Capture Visemes
        synthesizer.visemeReceived = (s, e) => {
            const timeInSeconds = e.audioOffset / 10000000;
            visemeData.current.push({ time: timeInSeconds, id: e.visemeId });
        };

        // Speak
        synthesizer.speakTextAsync(
            textToSpeak,
            (result) => {
                if (!isMounted) {
                    try { synthesizer.close(); } catch (e) { }
                    return;
                }
                if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                    const blob = new Blob([result.audioData], { type: 'audio/wav' });
                    const url = URL.createObjectURL(blob);
                    audioPlayer.current.src = url;
                    audioPlayer.current.play().then(() => setIsPlaying(true)).catch(console.error);
                }
                try { synthesizer.close(); } catch (e) { }
            },
            (error) => {
                console.error("Speech Error:", error);
                if (isMounted) try { synthesizer.close(); } catch (e) { }
            }
        );

        return () => { isMounted = false; };
    }, [textToSpeak]);

    // --- 5. THE ANIMATION LOOP (EXPRESSION HANDLER) ---
    useFrame(() => {
        if (!headMeshRef.current) return;
        const mesh = headMeshRef.current;

        // Safety: Stop playing state if audio ended
        if (isPlaying && audioPlayer.current.ended) setIsPlaying(false);

        // --- STEP A: CALCULATE TARGET MORPHS ---

        // Normalize emotion to lowercase (backend may send "HAPPY" but we need "happy")
        const normalizedEmotion = (emotion || "neutral").toLowerCase();

        // Debug: Log emotion changes
        // console.log("Current Emotion:", normalizedEmotion, "HeadMesh:", mesh.name);

        // 1. Start with the Base Emotion
        const currentEmotionData = EXPRESSIONS[normalizedEmotion] || EXPRESSIONS.neutral;
        let finalMorphs = { ...currentEmotionData };

        // 2. If Playing, OVERRIDE with Visemes
        if (isPlaying && !audioPlayer.current.paused) {
            const currentTime = audioPlayer.current.currentTime;
            const activeViseme = visemeData.current.findLast(v => v.time <= currentTime);

            if (activeViseme) {
                const visemeMorphs = VISEME_MAP_ARKIT[activeViseme.id];
                if (visemeMorphs) {
                    Object.keys(visemeMorphs).forEach((key) => {
                        // Add or Overwrite the emotion value with the speech value
                        // e.g., if Emotion has jawOpen: 0.0 and Speech has jawOpen: 0.5 -> We use 0.5
                        finalMorphs[key] = visemeMorphs[key];
                    });
                }
            }
        }

        // --- STEP B: APPLY TO MESH ---
        // Iterate through EVERY morph target the mesh has
        Object.keys(mesh.morphTargetDictionary).forEach((key) => {
            const index = mesh.morphTargetDictionary[key];

            // If our calculated "finalMorphs" has a value for this key, use it. 
            // Otherwise, target is 0 (relax the muscle).
            const targetValue = finalMorphs[key] || 0;

            // Smoothly interpolate (Lerp) current value to target value
            mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                mesh.morphTargetInfluences[index],
                targetValue,
                0.2 // Speed: 0.1 = Slow/Dreamy, 0.3 = Snappy
            );
        });
    });

    return (
        <group {...props} dispose={null}>
            <primitive object={clone} />
        </group>
    );
}

useGLTF.preload('/avatar.glb');