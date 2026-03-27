import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const LightSineModel = () => {
  const lightSineTexture = useTexture('/light%20sine.png');

  return (
    <group name="light-beam-group" position={[0, 5.5, 0.1]} rotation={[0, 0, Math.PI / 3.5]}>
      {/* Synchronized yellow Beam */}
      <mesh position={[0, -13.5, 0]} renderOrder={-5}>
        <cylinderGeometry args={[0.01, 5, 26, 12]} />
        <meshBasicMaterial
          color="yellow"
          transparent
          opacity={0.20}
          side={THREE.DoubleSide}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
          fog={false}
        />
      </mesh>
    </group>
  );
};
