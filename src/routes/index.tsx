import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Nav } from "@/components/Nav";
import { LandingScene } from "@/components/three/LandingScene";
import { randomTopic } from "@/lib/wiki";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rabbit Hole — Knowledge is a Universe" },
      { name: "description", content: "Dive into a cinematic 3D universe of interconnected ideas. Every topic becomes a galaxy of knowledge." },
      { property: "og:title", content: "Rabbit Hole — Knowledge is a Universe" },
      { property: "og:description", content: "An immersive 3D knowledge explorer." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [launching, setLaunching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function launch(t: string) {
    const v = t.trim();
    if (!v) return;
    setLaunching(true);
    setTimeout(() => {
      navigate({ to: "/explore/$topic", params: { topic: encodeURIComponent(v) } });
    }, 900);
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <Nav />

      {/* 3D Scene */}
      <div className="absolute inset-0">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 7], fov: 55 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <LandingScene launching={launching} />
          </Canvas>
        )}
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_95%)]" />

      {/* Hero overlay */}
      <AnimatePresence>
        {!launching && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-mono text-[11px] tracking-[0.4em] text-primary uppercase mb-6 flex items-center gap-3"
            >
              <span className="h-px w-10 bg-primary/60" />
              v01 · Cinematic Knowledge Explorer
              <span className="h-px w-10 bg-primary/60" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.9 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] max-w-5xl"
            >
              <span className="text-foreground">Knowledge</span>{" "}
              <span className="italic font-light text-muted-foreground">is a</span>{" "}
              <span className="text-glow-primary text-primary">Universe</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="mt-6 max-w-xl text-muted-foreground text-base md:text-lg leading-relaxed"
            >
              Explore any idea as a living galaxy. Discover hidden connections, dive
              through wormholes of thought, and travel deeper than search engines allow.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              onSubmit={(e) => { e.preventDefault(); launch(topic); }}
              className="mt-10 w-full max-w-xl"
            >
              <div className="group relative">
                <div className="absolute -inset-px rounded-full bg-gradient-to-r from-primary/40 via-secondary/40 to-highlight/40 opacity-60 blur-md group-focus-within:opacity-100 transition" />
                <div className="relative flex items-center glass-panel rounded-full pl-6 pr-2 py-2">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase mr-3">›</span>
                  <input
                    ref={inputRef}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic — black holes, hangul, ancient rome…"
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60 py-2 font-sans"
                  />
                  <MagneticButton onClick={() => launch(topic)} label="Enter" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/70">
                <button
                  type="button"
                  onClick={() => launch(randomTopic())}
                  className="px-3 py-1.5 rounded-full border border-highlight/30 text-highlight hover:bg-highlight/10 hover:border-highlight/60 transition"
                  style={{ color: "var(--highlight)" }}
                >
                  ✦ Surprise me
                </button>
                <span>or try:</span>
                {["Black hole", "Hangul", "Octopus"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => launch(t)}
                    className="px-2 py-1 rounded hover:text-primary transition"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launch flash */}
      <AnimatePresence>
        {launching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 30, opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-primary blur-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom ticker */}
      <div className="absolute bottom-5 left-0 right-0 z-10 flex items-center justify-between px-8 font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60">
        <span>scroll · drag · explore</span>
        <span className="hidden md:inline">⌖ 00.00.00 — observing cosmic field</span>
        <span>est. 2099</span>
      </div>
    </main>
  );
}

function MagneticButton({ label, onClick }: { label: string; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="submit"
      onClick={onClick}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r || !ref.current) return;
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0,0)";
      }}
      className="btn-magnetic hover:[&]:[box-shadow:0_0_50px_0_color-mix(in_oklab,var(--primary)_55%,transparent)] hover:text-foreground hover:-translate-y-0.5 transition-all"
    >
      {label} →
    </button>
  );
}
