import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Float, Cloud, Sphere, Environment, Sky } from '@react-three/drei';
import { LighthouseModel } from './Lighthouse';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const LighthouseContent = () => {
    const groupRef = useRef<THREE.Group>(null!);
    useEffect(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
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
                x: 0, y: -1, z: -4,
                duration: 1, ease: "power2.inOut"
            }, 0);
            tl.to(groupRef.current.scale, {
                x: 0.85, y: 0.85, z: 0.85,
                duration: 1, ease: "power2.inOut"
            }, 0);
            const beam = groupRef.current.getObjectByName('light-beam-group');
            if (beam) {
                tl.to(beam.rotation, {
                    z: -Math.PI / 8,
                    duration: 1, ease: "power2.inOut"
                }, 0);

                tl.to(beam.rotation, {
                    z: Math.PI / 8,
                    duration: 1, ease: "power2.inOut"
                }, 1);
            }

            tl.to(groupRef.current.position, {
                x: 4.5, y: -0.5, z: -1,
                duration: 1, ease: "power2.inOut"
            }, 1);
            tl.to(groupRef.current.scale, {
                x: 1, y: 1, z: 1,
                duration: 1, ease: "power2.inOut"
            }, 1);


        });

        return () => {
            mm.revert();
        };
    }, []);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 15, 10]} intensity={1.0} color="#fffcf0" />
            <pointLight position={[-3.2, 7.2, 1]} intensity={1.4} distance={18} decay={1.8} color="#ffe3a1" />

            <directionalLight
                position={[20, 30, 10]}
                intensity={0.8}
                color="#fff8e1"
            />

            <fogExp2 attach="fog" args={['#0f172a', 0.02]} />

            <Environment preset="night" environmentIntensity={0.5} />

            <Stars radius={120} depth={50} count={0} factor={0} />

            <group ref={groupRef} position={[-3.5, -0.5, 0]}>
                <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.2}>
                    <LighthouseModel />
                </Float>
            </group>

        </>
    );
};

export const LighthouseScene = () => {
    return (
        <div
            className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-950"
            style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
        >
            {/* Background Fog Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
            >
                <source src="/Fog.mp4" type="video/mp4" />
            </video>

            <Canvas
                shadows
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace,
                    alpha: true
                }}
                dpr={[1, 2]}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={40} />
                <React.Suspense fallback={null}>
                    <LighthouseContent />
                </React.Suspense>
            </Canvas>

            {/* STABLE CSS VIGNETTE FOR CINEMATIC FOCUS */}
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.8) 100%)'
                }}
            />
        </div>
    );
};
