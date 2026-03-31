import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Float, Cloud, Sphere, Environment, Sky, Html } from '@react-three/drei';
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
            <ambientLight intensity={2.2} />
            <pointLight position={[10, 15, 10]} intensity={6.0} color="#ffffff" />
            <pointLight position={[-3.2, 7.2, 1]} intensity={15.0} distance={30} decay={1.0} color="#ffffff" />

            <directionalLight
                position={[20, 30, 10]}
                intensity={4.0}
                color="#ffffff"
            />

            <fogExp2 attach="fog" args={['#0f172a', 0.008]} />
            
            {/* Background clouds with low renderOrder to stay behind everything */}
            <Cloud
                opacity={0.25}
                speed={0.4}
                segments={20}
                position={[-5, 2, -12]}
                color="#64748b"
                renderOrder={-10}
            />
            <Cloud
                opacity={0.2}
                speed={0.3}
                segments={20}
                position={[5, -3, -10]}
                color="#475569"
                renderOrder={-10}
            />
            <Cloud
                opacity={0.15}
                speed={0.2}
                segments={40}
                position={[0, 0, -18]}
                color="#334155"
                renderOrder={-10}
            />

            {/* Disabled Environment preset as requested for production stability */}
            {/* <Environment preset="night" environmentIntensity={0.5} /> */}

            <Stars radius={150} depth={60} count={5000} factor={4} saturation={0} fade speed={1} />

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
                className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-1000"
            >
                <source src="/fog.mp4" type="video/mp4" />
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
                <React.Suspense fallback={
                    <Html center>
                        <span className="text-white text-xs uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-full backdrop-blur-md">
                            Loading...
                        </span>
                    </Html>
                }>
                    <LighthouseContent />
                </React.Suspense>
            </Canvas>

            {/* STABLE CSS VIGNETTE FOR CINEMATIC FOCUS */}
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)'
                }}
            />
        </div>
    );
};
