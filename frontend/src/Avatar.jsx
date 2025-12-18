import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGraph, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import * as THREE from 'three';

// --- MAPPING STRATEGIES ---

// 1. STANDARD (Oculus/RPM default)
const VISEME_MAP_STANDARD = {
    0: 'viseme_sil', 1: 'viseme_aa', 2: 'viseme_aa', 3: 'viseme_O',
    4: 'viseme_E', 5: 'viseme_RR', 6: 'viseme_I', 7: 'viseme_U',
    8: 'viseme_O', 9: 'viseme_aa', 10: 'viseme_O', 11: 'viseme_aa',
    12: 'viseme_nn', 13: 'viseme_RR', 14: 'viseme_nn', 15: 'viseme_nn',
    16: 'viseme_nn', 17: 'viseme_TH', 18: 'viseme_FF', 19: 'viseme_DD',
    20: 'viseme_kk', 21: 'viseme_PP'
};

// 2. ARKIT (Apple Face Tracking)
const VISEME_MAP_ARKIT = {
    0: {}, 1: { jawOpen: 0.4 }, 2: { jawOpen: 0.5 }, 3: { jawOpen: 0.3, mouthFunnel: 0.4 },
    4: { jawOpen: 0.2, mouthSmileLeft: 0.2, mouthSmileRight: 0.2 },
    5: { jawOpen: 0.1, mouthPucker: 0.4 }, 6: { jawOpen: 0.1, mouthSmileLeft: 0.3, mouthSmileRight: 0.3 },
    7: { mouthPucker: 0.7 }, 8: { jawOpen: 0.3, mouthFunnel: 0.4 }, 9: { jawOpen: 0.4 },
    10: { jawOpen: 0.3, mouthFunnel: 0.4 }, 11: { jawOpen: 0.4 }, 12: { jawOpen: 0.1 },
    13: { jawOpen: 0.1, mouthPucker: 0.4 }, 14: { jawOpen: 0.1 }, 15: { jawOpen: 0.1 },
    16: { jawOpen: 0.1 }, 17: { jawOpen: 0.1 }, 18: { mouthPucker: 0.3, mouthRollUpper: 0.2 },
    19: { jawOpen: 0.1 }, 20: { jawOpen: 0.2 }, 21: { mouthPucker: 0.4 }
};

// 3. UPDATED EMOTIONS (Matches your 'mouthSmileLeft'/'Right' logs)
const EXPRESSIONS = {
    neutral: {},
    happy: {
        mouthSmileLeft: 0.5, mouthSmileRight: 0.5,
        browInnerUp: 0.3,
        cheekPuff: 0.1
    },
    sad: {
        mouthFrownLeft: 0.5, mouthFrownRight: 0.5,
        browDownLeft: 0.4, browDownRight: 0.4
    },
    surprised: {
        browInnerUp: 0.8,
        eyeWideLeft: 0.5, eyeWideRight: 0.5
    },
    angry: {
        browDownLeft: 0.8, browDownRight: 0.8,
        noseSneerLeft: 0.5, noseSneerRight: 0.5
    }
};

export function Model({ textToSpeak, emotion = "neutral", ...props }) {
    const { scene } = useGLTF('/avatar.glb');
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    // REFS
    const audioPlayer = useRef(new Audio());
    const visemeData = useRef([]);
    const synthesizerRef = useRef(null);
    const headMeshRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [morphType, setMorphType] = useState(null);

    // --- 1. SETUP & DETECT MORPHS ---
    useEffect(() => {
        let foundHead = null;
        clone.traverse((child) => {
            if (child.isMesh && child.morphTargetDictionary && Object.keys(child.morphTargetDictionary).length > 0) {
                if (!foundHead || child.name.includes("Head") || child.name.includes("Avatar")) {
                    foundHead = child;
                }
            }
        });

        if (foundHead) {
            headMeshRef.current = foundHead;
            const dict = foundHead.morphTargetDictionary;

            // Standard Mapping Detection
            if (Object.keys(dict).includes('viseme_aa')) {
                setMorphType('standard');
            } else if (Object.keys(dict).includes('jawOpen')) {
                setMorphType('arkit');
            }
        }
    }, [clone]);

    // --- 2. SAFE SPEECH GENERATION (Fixes "Object Disposed" Crash) ---
    useEffect(() => {
        let isMounted = true; // Track if component is alive

        // STOP previous audio/synthesis immediately
        audioPlayer.current.pause();
        setIsPlaying(false);
        if (synthesizerRef.current) {
            try { synthesizerRef.current.close(); } catch (e) { console.warn("Cleanup warning:", e); }
            synthesizerRef.current = null;
        }

        if (!textToSpeak) return;

        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
            import.meta.env.VITE_AZURE_KEY,
            import.meta.env.VITE_AZURE_REGION
        );
        speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

        const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, null);
        synthesizerRef.current = synthesizer;
        visemeData.current = [];

        synthesizer.visemeReceived = (s, e) => {
            const timeInSeconds = e.audioOffset / 10000000;
            visemeData.current.push({ time: timeInSeconds, id: e.visemeId });
        };

        synthesizer.speakTextAsync(
            textToSpeak,
            (result) => {
                // IF UNMOUNTED, STOP HERE
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

                // Close nicely
                try { synthesizer.close(); } catch (e) { }
                synthesizerRef.current = null;
            },
            (error) => {
                console.error("Speech Error:", error);
                if (isMounted) {
                    try { synthesizer.close(); } catch (e) { }
                }
            }
        );

        // Cleanup function
        return () => {
            isMounted = false;
            if (synthesizerRef.current) {
                try { synthesizerRef.current.close(); } catch (e) { }
            }
        };
    }, [textToSpeak]);

    // --- 3. ANIMATION LOOP ---
    useFrame(() => {
        if (!headMeshRef.current || !morphType) return;
        const mesh = headMeshRef.current;
        const currentTime = audioPlayer.current.currentTime;

        if (isPlaying && audioPlayer.current.ended) setIsPlaying(false);

        // 1. EMOTION BASE LAYER
        const currentEmotion = EXPRESSIONS[emotion] || EXPRESSIONS.neutral;
        let finalMorphs = { ...currentEmotion };

        // 2. VISEME OVERLAY
        if (isPlaying && !audioPlayer.current.paused) {
            const activeViseme = visemeData.current.findLast(v => v.time <= currentTime);
            if (activeViseme) {
                if (morphType === 'standard') {
                    const targetName = VISEME_MAP_STANDARD[activeViseme.id];
                    if (targetName) finalMorphs[targetName] = 1.0;
                } else if (morphType === 'arkit') {
                    const arkitMorphs = VISEME_MAP_ARKIT[activeViseme.id];
                    if (arkitMorphs) {
                        Object.keys(arkitMorphs).forEach(key => { finalMorphs[key] = arkitMorphs[key]; });
                    }
                }
            }
        }

        // 3. APPLY MORPHS
        Object.keys(mesh.morphTargetDictionary).forEach((key) => {
            const index = mesh.morphTargetDictionary[key];
            const targetValue = finalMorphs[key] || 0;

            mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                mesh.morphTargetInfluences[index],
                targetValue,
                0.2
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