import React, { useEffect, useRef, useMemo } from 'react';
import { useGraph, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

export function Model({ isSpeaking, ...props }) {
    const { scene } = useGLTF('/avatar.glb');
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);
    const headMeshRef = useRef(null);

    // FIND HEAD
    useEffect(() => {
        clone.traverse((child) => {
            if (child.isMesh && child.morphTargetDictionary && Object.keys(child.morphTargetDictionary).length > 0) {
                if (!headMeshRef.current || child.name.includes("Head")) {
                    headMeshRef.current = child;
                }
            }
        });
    }, [clone]);

    // ANIMATION LOOP
    useFrame((state) => {
        if (!headMeshRef.current) return;
        const mesh = headMeshRef.current;

        // 1. Get Jaw Index
        // (Check your logs: is it 'jawOpen' or 'mouthOpen'?)
        const jawIndex = mesh.morphTargetDictionary['jawOpen'];
        if (jawIndex === undefined) return;

        let targetOpen = 0;

        // 2. If Speaking, simulate mouth movement
        if (isSpeaking) {
            // Create a sine wave pattern that looks like talking
            // fast sine * slow sine gives variation
            const time = state.clock.elapsedTime;
            targetOpen = (Math.sin(time * 15) * 0.5 + 0.5) * (Math.sin(time * 5) * 0.5 + 0.5);
            targetOpen = targetOpen * 0.6; // Scale down (don't open too wide)
        }

        // 3. Lerp
        mesh.morphTargetInfluences[jawIndex] = THREE.MathUtils.lerp(
            mesh.morphTargetInfluences[jawIndex],
            targetOpen,
            0.2
        );
    });

    return (
        <group {...props} dispose={null}>
            <primitive object={clone} />
        </group>
    );
}
useGLTF.preload('/avatar.glb');