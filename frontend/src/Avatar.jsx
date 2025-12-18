// src/Avatar.jsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGraph, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

export function Model({
    audioSource, // Base64 Audio URL from backend
    emotion,     // "happy", "sad", "angry", "surprised", "neutral"
    ...props
}) {
    // Ensure you are using the VRM/GLB with ARKit blendshapes
    const { scene } = useGLTF('/avatar.glb');
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes, materials } = useGraph(clone);

    const audioRef = useRef(new Audio());
    const analyzerRef = useRef(null);
    const dataArrayRef = useRef(null);
    const [isTalking, setIsTalking] = useState(false);

    // --- 1. AUDIO HANDLING & ANALYZER SETUP ---
    useEffect(() => {
        if (!audioSource) return;

        // A. Setup Audio Source
        audioRef.current.src = audioSource;
        audioRef.current.crossOrigin = "anonymous";

        // B. Setup Analyzer (Only once)
        if (!analyzerRef.current) {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            // Connect the audio element to the analyzer
            const source = audioCtx.createMediaElementSource(audioRef.current);
            const analyzer = audioCtx.createAnalyser();
            analyzer.fftSize = 64; // Low detail needed for volume
            source.connect(analyzer);
            analyzer.connect(audioCtx.destination);

            analyzerRef.current = analyzer;
            dataArrayRef.current = new Uint8Array(analyzer.frequencyBinCount);
        }

        // C. Play
        audioRef.current.play().catch(e => console.error("Playback error:", e));
        setIsTalking(true);

        // D. Cleanup when audio ends
        audioRef.current.onended = () => {
            setIsTalking(false);
        };

    }, [audioSource]);

    // --- 2. EMOTION DEFINITIONS ---
    const EXPRESSIONS = {
        neutral: {},
        happy: { mouthSmile: 0.7, browInnerUp: 0.2, cheekPuff: 0.2 },
        sad: { mouthFrownLeft: 0.6, mouthFrownRight: 0.6, browDownLeft: 0.5, browDownRight: 0.5 },
        surprised: { browInnerUp: 1.0, eyeWideLeft: 0.6, eyeWideRight: 0.6, jawOpen: 0.1 },
        angry: { browDownLeft: 1.0, browDownRight: 1.0, noseSneerLeft: 0.7 }
    };

    // --- 3. ANIMATION LOOP ---
    useFrame(() => {
        if (!nodes.Wolf3D_Avatar) return;

        // A. CALCULATE LIP SYNC (Volume -> Jaw Open)
        let mouthOpenValue = 0;
        if (isTalking && analyzerRef.current && !audioRef.current.paused) {
            analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
            // Calculate average volume
            const average = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
            // Map volume (0-150 typical) to Morph Target (0.0-1.0)
            mouthOpenValue = Math.min(1, average / 50);
        }

        // B. APPLY EMOTION & LIP SYNC
        const currentEmotion = EXPRESSIONS[emotion] || EXPRESSIONS.neutral;

        // Iterate over all morph targets available on the model
        Object.keys(nodes.Wolf3D_Avatar.morphTargetDictionary).forEach((key) => {
            const index = nodes.Wolf3D_Avatar.morphTargetDictionary[key];
            if (index === undefined) return;

            // 1. Determine Target Value
            let targetValue = 0;

            // If it's a "talking" muscle, override with volume data
            if (key === 'jawOpen' || key === 'viseme_aa') {
                // Mix a bit of the emotion's jaw setting with the talking volume
                targetValue = Math.max(mouthOpenValue, (currentEmotion[key] || 0));
            } else {
                // Otherwise, just use the emotion value
                targetValue = currentEmotion[key] || 0;
            }

            // 2. Smoothly Interpolate (Lerp) to avoid snapping
            nodes.Wolf3D_Avatar.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                nodes.Wolf3D_Avatar.morphTargetInfluences[index],
                targetValue,
                0.2 // Speed of facial movement (0.1 = slow, 0.5 = fast)
            );
        });
    });

    return (
        <group {...props} dispose={null}>
            <primitive object={nodes.Hips} />
            <skinnedMesh
                name="Wolf3D_Avatar"
                geometry={nodes.Wolf3D_Avatar.geometry}
                material={materials.Wolf3D_Avatar}
                skeleton={nodes.Wolf3D_Avatar.skeleton}
                morphTargetDictionary={nodes.Wolf3D_Avatar.morphTargetDictionary}
                morphTargetInfluences={nodes.Wolf3D_Avatar.morphTargetInfluences}
            />
            {nodes.Wolf3D_Avatar_Transparent && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Avatar_Transparent.geometry}
                    material={materials.Wolf3D_Avatar_Transparent}
                    skeleton={nodes.Wolf3D_Avatar_Transparent.skeleton}
                />
            )}
        </group>
    );
}