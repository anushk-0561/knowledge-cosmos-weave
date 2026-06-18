import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Sphere, Icosahedron, Octahedron, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { NodeType, RelatedTopic } from "@/lib/wiki";
import type { TopicStat } from "@/lib/store";

interface GalaxyProps {
  topic: string;
  related: RelatedTopic[];
  stats?: TopicStat[];
  onSelect: (topic: string) => void;
  onCenter: () => void;
}

function colorFor(type: NodeType): string {
  switch (type) {
    case "planet": return "#00F5D4";
    case "star": return "#FFD166";
    case "crystal": return "#7B61FF";
    case "core": return "#FF2E88";
    case "blackhole": return "#0a0a1f";
  }
}

function NodeMesh({ type, color, size }: { type: NodeType; color: string; size: number }) {
  switch (type) {
    case "planet":
      return (
        <Sphere args={[size, 48, 48]}>
          <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.7} distort={0.2} speed={1.5} roughness={0.3} metalness={0.5} />
        </Sphere>
      );
    case "star":
      return (
        <Icosahedron args={[size, 1]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
        </Icosahedron>
      );
    case "crystal":
      return (
        <Octahedron args={[size * 1.1, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.9} roughness={0.1} flatShading />
        </Octahedron>
      );
    case "core":
      return (
        <group>
          <Sphere args={[size * 0.6, 24, 24]}>
            <meshBasicMaterial color={color} toneMapped={false} />
          </Sphere>
          <Torus args={[size * 1.1, size * 0.06, 12, 64]}>
            <meshBasicMaterial color={color} toneMapped={false} />
          </Torus>
        </group>
      );
    case "blackhole":
      return (
        <group>
          <Sphere args={[size * 0.8, 32, 32]}>
            <meshBasicMaterial color="#000000" />
          </Sphere>
          <Torus args={[size * 1.4, size * 0.1, 16, 96]} rotation={[Math.PI / 2.2, 0, 0]}>
            <meshBasicMaterial color="#FF2E88" toneMapped={false} />
          </Torus>
        </group>
      );
  }
}

function OrbitNode({
  topic,
  type,
  position,
  onSelect,
  index,
  boost = 0,
}: {
  topic: string;
  type: NodeType;
  position: [number, number, number];
  onSelect: (t: string) => void;
  index: number;
  boost?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  const [hover, setHover] = useState(false);
  const color = colorFor(type);
  const size = 0.35 + (index % 4) * 0.05 + boost;

  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + index) * 0.15;
    ref.current.rotation.y += dt * 0.4;
    const target = hover ? 1.3 : 1;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = "auto"; }}
      onClick={(e) => { e.stopPropagation(); onSelect(topic); }}
    >
      <NodeMesh type={type} color={color} size={size} />
      <pointLight color={color} intensity={(hover ? 3 : 1.2) + boost * 2} distance={4 + boost * 3} />
      {hover && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="px-3 py-1.5 rounded-full glass-panel font-mono text-[11px] tracking-widest uppercase text-foreground whitespace-nowrap">
            {topic}
          </div>
        </Html>
      )}
    </group>
  );
}

function EnergyBeam({ from, to, color }: { from: THREE.Vector3; to: THREE.Vector3; color: string }) {
  const points = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.y += 0.4;
    return new THREE.CatmullRomCurve3([from, mid, to]).getPoints(40);
  }, [from, to]);
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color={color} transparent opacity={0.35} />
    </line>
  );
}

function CenterNode({ topic, onCenter }: { topic: string; onCenter: () => void }) {
  const ref = useRef<THREE.Group>(null!);
  const [hover, setHover] = useState(false);
  useFrame((state, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.2;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });
  return (
    <group
      ref={ref}
      onPointerOver={() => { setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = "auto"; }}
      onClick={(e) => { e.stopPropagation(); onCenter(); }}
    >
      <Sphere args={[1.1, 96, 96]}>
        <MeshDistortMaterial
          color="#00F5D4"
          emissive="#7B61FF"
          emissiveIntensity={1.2}
          distort={0.35}
          speed={2}
          roughness={0.15}
          metalness={0.7}
        />
      </Sphere>
      <Sphere args={[1.55, 32, 32]}>
        <meshBasicMaterial color="#7B61FF" transparent opacity={0.08} side={THREE.BackSide} />
      </Sphere>
      <pointLight color="#00F5D4" intensity={3} distance={10} />
      <Html center distanceFactor={10} style={{ pointerEvents: "none" }}>
        <div className={`px-4 py-2 rounded-full glass-panel font-display font-semibold text-sm tracking-wide whitespace-nowrap ${hover ? "text-glow-primary" : ""}`}>
          {topic}
        </div>
      </Html>
    </group>
  );
}

export function Galaxy({ topic, related, stats = [], onSelect, onCenter }: GalaxyProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null!);

  const statMap = useMemo(() => new Map(stats.map((s) => [s.topic, s.count])), [stats]);

  const nodes = useMemo(() => {
    const arr: { pos: THREE.Vector3; topic: string; type: NodeType; boost: number }[] = [];
    const count = related.length;
    related.forEach((r, i) => {
      const angle = (i / Math.max(count, 1)) * Math.PI * 2;
      const ringIdx = i % 3;
      const radius = 3.2 + ringIdx * 1.6;
      const y = (Math.sin(i * 1.7) * 0.6) + (ringIdx - 1) * 0.2;
      const boost = Math.min(0.6, (statMap.get(r.title) ?? 0) * 0.15);
      arr.push({
        pos: new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius),
        topic: r.title,
        type: r.type,
        boost,
      });
    });
    return arr;
  }, [related, statMap]);

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.04;
    // Subtle camera breathing
    camera.position.y = Math.sin(Date.now() * 0.0003) * 0.3;
  });

  const center = new THREE.Vector3(0, 0, 0);

  return (
    <group ref={groupRef}>
      <CenterNode topic={topic} onCenter={onCenter} />
      {nodes.map((n, i) => (
        <group key={n.topic + i}>
          <EnergyBeam from={center} to={n.pos} color={colorFor(n.type)} />
          <OrbitNode topic={n.topic} type={n.type} position={[n.pos.x, n.pos.y, n.pos.z]} onSelect={onSelect} index={i} boost={n.boost} />
        </group>
      ))}
      {/* Ambient dust */}
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#7B61FF" distance={20} />
    </group>
  );
}