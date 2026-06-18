import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Icosahedron, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

export function EnergySphere({ intensity = 1 }: { intensity?: number }) {
  const group = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Mesh>(null!);
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += dt * 0.15;
      group.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (inner.current) inner.current.rotation.y -= dt * 0.6;
    if (ring1.current) ring1.current.rotation.z += dt * 0.4;
    if (ring2.current) ring2.current.rotation.x += dt * 0.3;
  });

  return (
    <group ref={group}>
      {/* Outer distorted shell */}
      <Sphere args={[1.6, 96, 96]}>
        <MeshDistortMaterial
          color="#00F5D4"
          emissive="#00F5D4"
          emissiveIntensity={1.2 * intensity}
          distort={0.45}
          speed={2}
          roughness={0.2}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* Core */}
      <Icosahedron ref={inner} args={[0.9, 2]}>
        <MeshWobbleMaterial
          color="#7B61FF"
          emissive="#FF2E88"
          emissiveIntensity={1.5 * intensity}
          factor={0.6}
          speed={3}
          wireframe
        />
      </Icosahedron>

      {/* Glow halo */}
      <Sphere args={[2.2, 48, 48]}>
        <meshBasicMaterial color="#7B61FF" transparent opacity={0.07} side={THREE.BackSide} />
      </Sphere>

      {/* Energy rings */}
      <mesh ref={ring1}>
        <torusGeometry args={[2.4, 0.015, 16, 200]} />
        <meshBasicMaterial color="#00F5D4" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.8, 0.01, 16, 200]} />
        <meshBasicMaterial color="#FF2E88" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}