import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { clearHistory, getHistory, type VisitEntry } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Trails — Rabbit Hole" },
      { name: "description", content: "Your constellation of explored worlds." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [history, setHistory] = useState<VisitEntry[]>([]);
  useEffect(() => setHistory(getHistory()), []);

  const worlds = history.length;
  const unique = new Set(history.map((h) => h.topic)).size;
  const deepest = history.reduce((m, h) => Math.max(m, h.depth), 0);

  return (
    <main className="relative min-h-screen pt-28 pb-20 px-6">
      <Nav />
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-2">◴ Exploration Trails</div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold">
            Constellation <span className="italic font-light text-muted-foreground">of</span> <span className="text-glow-primary text-primary">memory</span>
          </h1>
        </motion.div>

        <div className="mt-10 grid grid-cols-3 gap-4">
          <Stat label="Worlds Visited" value={worlds} />
          <Stat label="Unique Topics" value={unique} />
          <Stat label="Deepest Dive" value={deepest} accent />
        </div>

        <div className="mt-12 glass-panel rounded-3xl p-8 relative overflow-hidden">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6">⟡ Constellation Map</div>
          {worlds === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              Empty space. <Link to="/" className="text-primary hover:underline">Launch your first journey →</Link>
            </div>
          ) : (
            <ConstellationMap entries={history} />
          )}
        </div>

        {worlds > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => { clearHistory(); setHistory([]); }}
              className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-highlight transition"
            >
              ✕ Erase trails
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-5xl font-semibold ${accent ? "text-highlight text-glow-highlight" : "text-primary text-glow-primary"}`}>
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );
}

function ConstellationMap({ entries }: { entries: VisitEntry[] }) {
  const w = 800, h = 400;
  const pts = entries.map((e, i) => {
    const x = 40 + ((i * 137) % (w - 80));
    const y = 40 + ((i * 73 + (e.topic.length * 19)) % (h - 80));
    return { x, y, e, i };
  });
  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[380px]">
        {pts.slice(1).map((p, idx) => {
          const prev = pts[idx];
          return (
            <line
              key={`l-${idx}`}
              x1={prev.x} y1={prev.y} x2={p.x} y2={p.y}
              stroke="url(#beam)" strokeWidth={0.8} opacity={0.45}
            />
          );
        })}
        <defs>
          <linearGradient id="beam" x1="0" x2="1">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="100%" stopColor="#7B61FF" />
          </linearGradient>
          <radialGradient id="star">
            <stop offset="0%" stopColor="#00F5D4" stopOpacity="1" />
            <stop offset="100%" stopColor="#00F5D4" stopOpacity="0" />
          </radialGradient>
        </defs>
        {pts.map((p) => (
          <g key={p.i}>
            <circle cx={p.x} cy={p.y} r={10} fill="url(#star)" />
            <circle cx={p.x} cy={p.y} r={2.5} fill="#F8FAFC" />
            <text x={p.x + 8} y={p.y + 3} fontSize="9" fill="#94A3B8" fontFamily="JetBrains Mono, monospace">
              {p.e.topic.length > 22 ? p.e.topic.slice(0, 22) + "…" : p.e.topic}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}