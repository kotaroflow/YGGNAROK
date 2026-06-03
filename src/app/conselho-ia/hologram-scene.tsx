"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function HologramCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.4;
      meshRef.current.rotation.x = elapsed * 0.15;
      const scale = 1 + Math.sin(elapsed * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = elapsed * 0.8;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -elapsed * 0.6;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial color="#f5c400" wireframe transparent opacity={0.25} />
      </mesh>
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.2, 0.015, 8, 64]} />
        <meshBasicMaterial color="#f5c400" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.5, 0.01, 8, 64]} />
        <meshBasicMaterial color="#f5c400" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export function HologramScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
      <ambientLight intensity={0.8} />
      <HologramCore />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
