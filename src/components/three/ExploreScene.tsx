import { Suspense } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { StarField } from "./StarField";
import { Galaxy } from "./Galaxy";
import type { RelatedTopic } from "@/lib/wiki";

export function ExploreScene({
  topic,
  related,
  onSelect,
  onCenter,
}: {
  topic: string;
  related: RelatedTopic[];
  onSelect: (t: string) => void;
  onCenter: () => void;
}) {
  return (
    <Suspense fallback={null}>
      <color attach="background" args={["#050816"]} />
      <fog attach="fog" args={["#050816", 14, 50]} />
      <ambientLight intensity={0.3} />
      <StarField count={2000} radius={50} speed={0.01} />
      <Galaxy topic={topic} related={related} onSelect={onSelect} onCenter={onCenter} />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.15} luminanceSmoothing={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
      </EffectComposer>
    </Suspense>
  );
}