import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Nav } from "@/components/Nav";
import { ExploreScene } from "@/components/three/ExploreScene";
import { KnowledgePanel } from "@/components/KnowledgePanel";
import { Wormhole } from "@/components/Wormhole";
import { fetchRelated, fetchSummary, randomTopic, type RelatedTopic, type WikiSummary } from "@/lib/wiki";
import { pushHistory } from "@/lib/store";

export const Route = createFileRoute("/explore/$topic")({
  head: ({ params }) => {
    const t = decodeURIComponent(params.topic);
    return {
      meta: [
        { title: `${t} — Rabbit Hole` },
        { name: "description", content: `Explore ${t} as a living 3D galaxy of interconnected ideas.` },
        { property: "og:title", content: `${t} — Rabbit Hole` },
      ],
    };
  },
  component: ExplorePage,
});

function ExplorePage() {
  const { topic: rawTopic } = Route.useParams();
  const navigate = useNavigate();
  const topic = useMemo(() => decodeURIComponent(rawTopic), [rawTopic]);

  const [summary, setSummary] = useState<WikiSummary | null>(null);
  const [related, setRelated] = useState<RelatedTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [wormholeTo, setWormholeTo] = useState<string | null>(null);
  const depthRef = useRef<number>(1);
  const pathRef = useRef<string[]>([topic]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchSummary(topic), fetchRelated(topic)]).then(([s, r]) => {
      if (cancelled) return;
      setSummary(s);
      setRelated(r);
      setLoading(false);
      pushHistory({ topic, at: Date.now(), depth: depthRef.current });
    });
    return () => { cancelled = true; };
  }, [topic]);

  const goTo = useCallback((next: string) => {
    if (next === topic) return;
    depthRef.current += 1;
    pathRef.current.push(next);
    setWormholeTo(next);
    setTimeout(() => {
      navigate({ to: "/explore/$topic", params: { topic: encodeURIComponent(next) } });
      setTimeout(() => setWormholeTo(null), 200);
    }, 1100);
  }, [navigate, topic]);

  const goSurprise = useCallback(() => goTo(randomTopic()), [goTo]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <Nav />

      {/* 3D */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 2, 12], fov: 55 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ExploreScene
            topic={topic}
            related={related}
            onSelect={goTo}
            onCenter={() => setPanelOpen(true)}
          />
        </Canvas>
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_98%)]" />

      {/* Topic tag overlay */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 -translate-x-1/2 top-24 z-10 flex flex-col items-center pointer-events-none"
      >
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-1">
          ▲ Galaxy · Depth {String(depthRef.current).padStart(2, "0")}
        </div>
        <div className="font-display text-2xl md:text-3xl font-semibold text-glow-primary">{topic}</div>
      </motion.div>

      {/* Controls overlay */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-3 pointer-events-auto">
        <button
          onClick={() => navigate({ to: "/" })}
          className="glass-panel rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition"
        >
          ← Return home
        </button>
        <button
          onClick={goSurprise}
          className="glass-panel rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-primary transition"
          style={{ color: "var(--highlight)" }}
        >
          ✦ Surprise me
        </button>
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {panelOpen && (
          <KnowledgePanel
            loading={loading}
            summary={summary}
            related={related}
            depth={depthRef.current}
            onSelect={goTo}
            onClose={() => setPanelOpen(false)}
            onSurprise={goSurprise}
          />
        )}
      </AnimatePresence>

      {/* Re-open tab */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 glass-panel rounded-full px-4 py-3 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-primary transition"
        >
          Open panel ›
        </button>
      )}

      <AnimatePresence>
        {wormholeTo && <Wormhole to={wormholeTo} />}
      </AnimatePresence>
    </main>
  );
}