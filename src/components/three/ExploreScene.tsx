import { Suspense } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { StarField } from "./StarField";
import { Galaxy } from "./Galaxy";
import type { RelatedTopic } from "@/lib/wiki";
import type { TopicStat } from "@/lib/store";

export function ExploreScene({
  topic,
  related,
  stats,
  onSelect,
  onCenter,
}: {
  topic: string;
  related: RelatedTopic[];
  stats?: TopicStat[];
  onSelect: (t: string) => void;
  onCenter: () => void;
}) {
  const density = Math.min(3000, 1500 + (stats?.length ?? 0) * 60);
  return (
    <Suspense fallback={null}>
      <color attach="background" args={["#050816"]} />
      <fog attach="fog" args={["#050816", 14, 50]} />
      <ambientLight intensity={0.3} />
      <StarField count={density} radius={50} speed={0.01} />
      <Galaxy topic={topic} related={related} stats={stats ?? []} onSelect={onSelect} onCenter={onCenter} />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.15} luminanceSmoothing={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
      </EffectComposer>
    </Suspense>
  );
}