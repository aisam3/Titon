import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Float, Cloud, Sphere, Environment } from '@react-three/drei';
import { LighthouseModel } from './Lighthouse';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LighthouseContent = () => {
    const groupRef = useRef<THREE.Group>(null!);
    const beamRotationRef = useRef({ val: 0 });

    useEffect(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
            beamRotationRef.current.val = Math.PI / 3.5;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#index-container",
                    start: "top top",
                    endTrigger: "#achievements-section",
                    end: "bottom bottom",
                    scrub: 1.5,
                }
            });

            tl.to(groupRef.current.position, {
                x: 0, y: -2.5, z: -4,
                duration: 1, ease: "power2.inOut"
            }, 0);
            tl.to(groupRef.current.scale, {
                x: 0.85, y: 0.85, z: 0.85,
                duration: 1, ease: "power2.inOut"
            }, 0);
            tl.to(beamRotationRef.current, {
                val: 0,
                duration: 1, ease: "power2.inOut"
            }, 0);

            tl.to(groupRef.current.position, {
                x: 4.5, y: -1.5, z: -1,
                duration: 1, ease: "power2.inOut"
            }, 1);
            tl.to(groupRef.current.scale, {
                x: 1, y: 1, z: 1,
                duration: 1, ease: "power2.inOut"
            }, 1);
            tl.to(beamRotationRef.current, {
                val: -Math.PI / 4,
                duration: 1, ease: "power2.inOut"
            }, 1);
        });

        return () => mm.revert();
    }, []);

    return (
        <>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 15, 10]} intensity={2.0} color="#fffcf0" />

            <directionalLight
                position={[20, 30, 10]}
                intensity={2.5}
                color="#fff8e1"
                castShadow
                shadow-mapSize={[2048, 2048]}
            />

            <fog attach="fog" args={['#f8fafc', 10, 40]} />

            <Environment preset="dawn" environmentIntensity={1.0} />

            <Stars radius={120} depth={50} count={0} factor={0} /> // No stars in daylight

            <group ref={groupRef} position={[-3.5, -2, 0]}>
                <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
                    <LighthouseModel
                        beamRotationRef={beamRotationRef}
                    />
                </Float>
            </group>
        </>
    );
};

export const LighthouseScene = () => {
    return (
        <div
            className="fixed inset-0 z-0 bg-[#f8fafc] pointer-events-none"
            style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
        >
            <Canvas
                shadows
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace
                }}
                dpr={[1, 2]}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={40} />
                <LighthouseContent />
            </Canvas>
        </div>
    );
};
