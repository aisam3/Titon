import React from 'react';
import { useTexture } from '@react-three/drei';
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
          <meshBasicMaterial
            map={lighthouseTexture}
            transparent
            alphaTest={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* MIST AT BASE */}
        <group position={[0, -8.5, 0.5]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[14, 8, 1]} renderOrder={1}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              color="#1e293b"
              transparent
              opacity={0.4}
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
