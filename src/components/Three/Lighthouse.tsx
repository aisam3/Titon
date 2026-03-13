import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Cone, Sphere, Torus, Dodecahedron, Box } from '@react-three/drei';
import * as THREE from 'three';

export const LighthouseModel = ({ beamRotationRef }: { beamRotationRef: React.MutableRefObject<{ val: number }> }) => {
  const beamRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    // Strict Scroll-Linked Rotation
    if (beamRef.current) {
      beamRef.current.rotation.y = beamRotationRef.current.val;
    }
  });

  return (
    <group>
      {/* 1. PREMIUM ARCHITECTURAL BASE */}
      <group position={[0, -3.8, 0]}>
        {/* Main Foundation Tier 1 */}
        <Cylinder args={[3.2, 3.5, 0.4, 64]}>
          <meshPhysicalMaterial color="#2d3748" roughness={0.8} metalness={0.2} />
        </Cylinder>
        {/* Foundation Tier 2 */}
        <Cylinder args={[2.5, 2.8, 0.6, 64]} position={[0, 0.5, 0]}>
          <meshPhysicalMaterial color="#cbd5e0" roughness={0.9} />
        </Cylinder>
      </group>

      {/* 2. SLIM TAPERED TOWER */}
      <group position={[0, -0.2, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 2.6, 6.5, 64]} />
          <meshPhysicalMaterial 
            color="#f8fafc" 
            roughness={0.85} 
            metalness={0.05}
            envMapIntensity={0.8}
            reflectivity={0.3}
          />
        </mesh>
        
        {/* Architectural Rings */}
        {[1.2, -1.5, -2.8].map((y_pos, idx) => (
          <Torus 
            key={idx}
            args={[1.6 - (idx * 0.3), 0.08, 12, 64]} 
            position={[0, y_pos, 0]} 
            rotation={[Math.PI/2, 0, 0]}
          >
            <meshPhysicalMaterial color="#475569" roughness={0.5} metalness={0.4} />
          </Torus>
        ))}
      </group>

      {/* 3. BALCONY & REFINED RAILINGS */}
      <group position={[0, 3.2, 0]}>
        {/* Balcony Floor - Wider and sleeker */}
        <Cylinder args={[1.8, 1.8, 0.15, 64]}>
          <meshPhysicalMaterial color="#1a202c" metalness={0.8} roughness={0.2} />
        </Cylinder>
        
        {/* Refined Metal Railings */}
        <group position={[0, 0.4, 0]}>
          {[...Array(32)].map((_, i) => (
            <Cylinder 
              key={i} 
              args={[0.012, 0.012, 0.8, 8]} 
              position={[1.7 * Math.cos((i / 32) * Math.PI * 2), 0, 1.7 * Math.sin((i / 32) * Math.PI * 2)]}
            >
              <meshPhysicalMaterial color="#0f172a" metalness={1} roughness={0.1} />
            </Cylinder>
          ))}
          <Torus args={[1.7, 0.015, 12, 64]} position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial color="#0f172a" metalness={1} roughness={0.1} />
          </Torus>
          <Torus args={[1.7, 0.015, 12, 64]} position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
             <meshPhysicalMaterial color="#0f172a" metalness={1} roughness={0.1} />
          </Torus>
        </group>
      </group>

      {/* 4. LANTERN ROOM - Detailed Optics & Slate Roof */}
      <group position={[0, 4.2, 0]}>
        {/* Glass Cylinder */}
        <Cylinder args={[1.0, 1.0, 1.8, 32, 1, true]}>
          <meshPhysicalMaterial 
            color="#e2e8f0" 
            transparent 
            opacity={0.1} 
            transmission={1} 
            thickness={1} 
            roughness={0} 
            ior={1.5}
            envMapIntensity={2}
          />
        </Cylinder>
        
        {/* Structural Frame */}
        {[...Array(12)].map((_, i) => (
          <Box key={i} args={[0.04, 1.8, 0.04]} position={[0.98 * Math.cos((i / 12) * Math.PI * 2), 0, 0.98 * Math.sin((i / 12) * Math.PI * 2)]}>
            <meshPhysicalMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
          </Box>
        ))}

        {/* SLATE BLUE ROOF */}
        <group position={[0, 0.9, 0]}>
          <Cone args={[1.4, 1.0, 32]} position={[0, 0.5, 0]}>
            <meshPhysicalMaterial 
              color="#334155" 
              metalness={0.7} 
              roughness={0.4} 
              envMapIntensity={1.2}
            />
          </Cone>
          <Sphere args={[0.1, 16, 16]} position={[0, 1.1, 0]}>
            <meshPhysicalMaterial color="#0f172a" metalness={1} roughness={0.1} />
          </Sphere>
        </group>
      </group>

      {/* 5. INDEPENDENT ROTATING LIGHT PIVOT */}
      <group position={[0, 4, 0]} ref={beamRef}>
        {/* The Lamp Housing */}
        <Box args={[0.3, 0.5, 0.3]}>
            <meshPhysicalMaterial color="#111" metalness={1} roughness={0.2} />
        </Box>
        
        <group position={[0, 0, 0.2]}>
            {/* The Lens Surface */}
            <Sphere args={[0.15, 16, 16]} scale={[1, 1, 0.5]}>
                <meshStandardMaterial color="#fff" emissive="#ffddaa" emissiveIntensity={1} />
            </Sphere>
        </group>
      </group>
    </group>
  );
};
