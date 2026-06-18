import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Sphere } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { StarField } from "./StarField";
import type { VisitEntry, Connection } from "@/lib/store";

interface Props {
  entries: VisitEntry[];
  connections: Connection[];
  onSelect: (topic: string) => void;
}

interface Node {
  topic: string;
  pos: THREE.Vector3;
  count: number;
  firstAt: number;
  connects: number;
}

function buildNodes(entries: VisitEntry[], connections: Connection[]): Node[] {
  const map = new Map<string, Node>();
  entries.forEach((e, i) => {
    if (map.has(e.topic)) {
      const n = map.get(e.topic)!;
      n.count += 1;
      return;
    }
    const seed = [...e.topic].reduce((a, c) => a + c.charCodeAt(0), i);
    const phi = Math.acos(1 - 2 * ((seed * 9301 + 49297) % 233280) / 233280);
    const theta = (seed * 1.6180339) % (Math.PI * 2);
    const r = 5 + ((seed % 40) / 10);
    map.set(e.topic, {
      topic: e.topic,
      pos: new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.7,
        r * Math.sin(phi) * Math.sin(theta),
      ),
      count: 1,
      firstAt: e.at,
      connects: 0,
    });
  });
  for (const c of connections) {
    if (map.has(c.a)) map.get(c.a)!.connects += 1;
    if (map.has(c.b)) map.get(c.b)!.connects += 1;
  }
  return [...map.values()];
}

function Star({ node, onSelect, onHover }: { node: Node; onSelect: (t: string) => void; onHover: (n: Node | null) => void }) {
  const ref = useRef<THREE.Group>(null!);
  const [hover, setHover] = useState(false);
  const size = 0.18 + Math.min(node.count, 8) * 0.05;
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    const k = 1 + Math.sin(t * 1.4 + node.pos.x) * 0.08 + (hover ? 0.3 : 0);
    ref.current.scale.setScalar(k);
  });
  return (
    <group
      ref={ref}
      position={node.pos}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); onHover(node); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); onHover(null); document.body.style.cursor = "auto"; }}
      onClick={(e) => { e.stopPropagation(); onSelect(node.topic); }}
    >
      <Sphere args={[size, 24, 24]}>
        <meshBasicMaterial color={hover ? "#FF2E88" : "#00F5D4"} toneMapped={false} />
      </Sphere>
      <Sphere args={[size * 2.6, 16, 16]}>
        <meshBasicMaterial color="#00F5D4" transparent opacity={0.08} />
      </Sphere>
      <pointLight color={hover ? "#FF2E88" : "#00F5D4"} intensity={hover ? 3 : 1.4} distance={5} />
    </group>
  );
}

function Beam({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const points = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.add(new THREE.Vector3(0, 0.4, 0));
    return new THREE.CatmullRomCurve3([from, mid, to]).getPoints(30);
  }, [from, to]);
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color="#7B61FF" transparent opacity={0.4} />
    </line>
  );
}

function SceneInner({ entries, connections, onSelect }: Props) {
  const [hovered, setHovered] = useState<Node | null>(null);
  const nodes = useMemo(() => buildNodes(entries, connections), [entries, connections]);
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.topic, n])), [nodes]);
  const group = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { if (group.current) group.current.rotation.y += dt * 0.04; });

  return (
    <>
      <color attach="background" args={["#050816"]} />
      <fog attach="fog" args={["#050816", 18, 60]} />
      <ambientLight intensity={0.4} />
      <StarField count={1600} radius={45} speed={0.008} />
      <group ref={group}>
        {connections.map((c, i) => {
          const a = nodeMap.get(c.a); const b = nodeMap.get(c.b);
          if (!a || !b) return null;
          return <Beam key={i} from={a.pos} to={b.pos} />;
        })}
        {nodes.map((n) => (
          <Star key={n.topic} node={n} onSelect={onSelect} onHover={setHovered} />
        ))}
      </group>
      {hovered && (
        <Html position={[hovered.pos.x, hovered.pos.y + 0.8, hovered.pos.z]} center style={{ pointerEvents: "none" }}>
          <div className="glass-panel rounded-xl px-4 py-3 min-w-[180px] text-center">
            <div className="font-display text-sm font-semibold text-glow-primary text-primary">{hovered.topic}</div>
            <div className="mt-1 font-mono text-[9px] tracking-[0.25em] uppercase text-muted-foreground">
              {new Date(hovered.firstAt).toLocaleDateString()} · {hovered.connects} links
            </div>
          </div>
        </Html>
      )}
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
      <OrbitControls enablePan={false} enableZoom enableRotate minDistance={6} maxDistance={30} autoRotate autoRotateSpeed={0.25} />
    </>
  );
}

export function Constellation(props: Props) {
  return (
    <Canvas camera={{ position: [0, 4, 16], fov: 55 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <SceneInner {...props} />
    </Canvas>
  );
}