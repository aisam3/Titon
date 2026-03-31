import React from 'react';
import { useTexture, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { LightSineModel } from './LightSine';

export const LighthouseModel = () => {
  const lighthouseTexture = useTexture('/light-house.png');

  return (
    <group scale={1.2}>
      {/* 1. MAIN LIGHTHOUSE SPRITE/IMAGE */}
      <group position={[0, -2.5, 0]}>
        <mesh scale={[15, 20, 1]} position={[0, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            map={lighthouseTexture}
            transparent
            alphaTest={0.5}
            side={THREE.DoubleSide}
            emissive="#ffffff"
            emissiveIntensity={0}
          />
        </mesh>

        {/* MIST AT BASE - Moved behind the lighthouse (z < 0) and set low renderOrder */}
        <group position={[0, -8.5, -0.5]}>
          <Cloud
            opacity={0.35}
            speed={0.3}
            segments={20}
            position={[0, 0, 0]}
            color="#475569"
            scale={6}
            renderOrder={-5}
          />
          <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[14, 8, 1]} renderOrder={-5}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#1e293b"
              transparent
              opacity={0.3}
              blending={THREE.NormalBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        <LightSineModel />
      </group>
    </group>
  );
};
