import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { getDiscoveryScore } from "@/lib/store";

export const Route = createFileRoute("/case-study")({
  head: () => ({
    meta: [
      { title: "Case Study — Rabbit Hole" },
      { name: "description", content: "How Rabbit Hole transforms knowledge exploration into an immersive 3D universe." },
      { property: "og:title", content: "Rabbit Hole — Case Study" },
      { property: "og:description", content: "A portfolio deep-dive into the engineering, design, and craft behind Rabbit Hole." },
    ],
  }),
  component: CaseStudy,
});

const TECHS = [
  { name: "React", desc: "Component model for the cinematic UI shell." },
  { name: "TypeScript", desc: "Strict typing across data, scene graph, and routes." },
  { name: "Three.js", desc: "Low-level GPU primitives powering the universe." },
  { name: "React Three Fiber", desc: "Declarative 3D scenes with React semantics." },
  { name: "Drei", desc: "Post-processing, helpers, controls." },
  { name: "Framer Motion", desc: "Choreographed transitions and entrances." },
  { name: "TanStack Router", desc: "Type-safe routes and seamless transitions." },
  { name: "Wikipedia REST", desc: "Live source of truth for every node." },
];

const CHALLENGES = [
  { title: "Real-Time Graph Rendering", body: "Render thousands of interconnected nodes without dropping frames using instanced meshes and culling." },
  { title: "Camera Navigation", body: "Cinematic transitions through depth — wormhole warps, breathing cameras, dolly-zoom feel." },
  { title: "Performance Optimization", body: "Bloom, fog, and particles tuned to maintain 60fps on mid-range hardware via DPR clamping and selective post-processing." },
  { title: "Dynamic Node Generation", body: "Topic relationships derived live from Wikipedia, mapped onto a deterministic 3D distribution." },
  { title: "3D Interaction Design", body: "Intuitive hover, click, and focus across a spatial canvas without sacrificing accessibility." },
];

function CaseStudy() {
  const [s, setS] = useState({ topics: 0, connections: 0, deepest: 0, total: 0 });
  useEffect(() => {
    const d = getDiscoveryScore();
    setS({ topics: d.topics, connections: d.connections, deepest: d.deepest, total: d.total });
  }, []);

  return (
    <main className="relative min-h-screen pt-28 pb-24 px-6">
      <Nav />
      <div className="mx-auto max-w-5xl space-y-24">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-3">◇ Case Study · 2026</div>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.05]">
            Knowledge as a <span className="text-glow-primary text-primary">living universe</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Rabbit Hole reimagines discovery — turning every search into a journey through a cinematic 3D galaxy of interconnected ideas.
          </p>
        </motion.section>

        <Section index="01" label="The Problem" headline="Search engines show lists. They don't visualize how ideas connect.">
          Most knowledge platforms treat information as isolated pages. Users read in silos, miss the relationships between concepts, and lose the bigger picture. Curiosity deserves a better interface than a vertical scroll.
        </Section>

        <Section index="02" label="The Solution" headline="An immersive 3D universe where concepts become celestial objects." accent>
          Rabbit Hole turns learning into exploration. Topics orbit as planets, stars, and cores; connections flow as light. Cinematic transitions carry the user through depth, and the universe grows organically with their curiosity.
        </Section>

        <section>
          <SectionHead index="03" label="Technology" headline="A stack built for the GPU and the senses." />
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {TECHS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="glass-panel rounded-2xl p-4 cursor-default"
              >
                <div className="h-8 w-8 rounded-lg border border-primary/40 flex items-center justify-center text-primary text-glow-primary text-sm font-mono">
                  {t.name.slice(0, 1)}
                </div>
                <div className="mt-3 font-display font-semibold">{t.name}</div>
                <div className="mt-1 text-xs text-muted-foreground leading-snug">{t.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <SectionHead index="04" label="Engineering Challenges" headline="Where the craft lives." />
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            {CHALLENGES.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-panel rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-secondary/25 blur-3xl" />
                <div className="relative">
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary">Ch.{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="mt-2 font-display text-xl font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <SectionHead index="05" label="Results" headline="Numbers from a living instance." />
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Result label="Topics Explored" value={s.topics} />
            <Result label="Connections" value={s.connections} />
            <Result label="Deepest Dive" value={s.deepest} />
            <Result label="Avg Frame Rate" value={60} suffix=" fps" accent />
          </div>
          <div className="mt-4 glass-panel rounded-2xl p-6">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Engagement</div>
            <div className="mt-2 font-display text-2xl font-semibold">
              {s.total} <span className="text-muted-foreground text-base font-mono">XP generated by exploration</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHead({ index, label, headline }: { index: string; label: string; headline: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-2">{index} · {label}</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-3xl">{headline}</h2>
    </motion.div>
  );
}

function Section({ index, label, headline, accent, children }: { index: string; label: string; headline: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <section className="grid md:grid-cols-[1fr,1.4fr] gap-10 items-start">
      <div>
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-2">{index} · {label}</div>
        <h2 className={`font-display text-3xl md:text-4xl font-semibold leading-tight ${accent ? "text-glow-primary text-primary" : ""}`}>
          {headline}
        </h2>
      </div>
      <p className="text-muted-foreground leading-relaxed text-lg">{children}</p>
    </section>
  );
}

function Result({ label, value, suffix = "", accent }: { label: string; value: number; suffix?: string; accent?: boolean }) {
  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
      <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full blur-3xl ${accent ? "bg-highlight/30" : "bg-primary/25"}`} />
      <div className="relative">
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">{label}</div>
        <div className={`mt-2 font-display text-4xl font-semibold ${accent ? "text-highlight text-glow-highlight" : "text-primary text-glow-primary"}`}>
          {value}{suffix}
        </div>
      </div>
    </div>
  );
}