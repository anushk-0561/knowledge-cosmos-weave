import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Nav } from "@/components/Nav";
import { getDiscoveryScore, type DiscoveryScore } from "@/lib/store";

export const Route = createFileRoute("/score")({
  head: () => ({
    meta: [
      { title: "Discovery Score — Rabbit Hole" },
      { name: "description", content: "A holographic analytics dashboard of your knowledge journey." },
    ],
  }),
  component: ScorePage,
});

function ScorePage() {
  const [score, setScore] = useState<DiscoveryScore | null>(null);
  useEffect(() => setScore(getDiscoveryScore()), []);
  if (!score) return <main className="min-h-screen"><Nav /></main>;

  return (
    <main className="relative min-h-screen pt-28 pb-20 px-6">
      <Nav />
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-2">◊ Discovery Score</div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold">
            Holographic <span className="text-glow-primary text-primary">analytics</span>
          </h1>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <RankCard score={score} />
          <RingCard label="Topics Explored" value={score.topics} max={Math.max(60, score.topics)} unit="topics" />
          <RingCard label="Total Connections" value={score.connections} max={Math.max(60, score.connections)} accent unit="links" />
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Metric label="Deepest Hole" value={score.deepest} suffix="" />
          <Metric label="Longest Chain" value={score.longestChain} suffix=" jumps" />
          <Metric label="Sessions" value={score.sessions} suffix="" />
          <Metric label="Avg Depth" value={score.avgDepth} suffix="" />
          <Metric label="Total Score" value={score.total} accent suffix=" XP" />
        </div>

        <div className="mt-8 glass-panel rounded-2xl p-6">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">⟡ Rarest Topic Discovered</div>
          <div className="mt-2 font-display text-2xl font-semibold text-glow-highlight" style={{ color: "var(--highlight)" }}>
            {score.rarest}
          </div>
        </div>

        <div className="mt-8">
          <RankLadder current={score.rank.index} />
        </div>
      </div>
    </main>
  );
}

function useAnimatedNumber(target: number) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv, target, { duration: 1.2, ease: "easeOut" });
    const unsub = mv.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [target, mv]);
  return display;
}

function Metric({ label, value, suffix = "", accent }: { label: string; value: number; suffix?: string; accent?: boolean }) {
  const v = useAnimatedNumber(value);
  const display = Number.isInteger(value) ? Math.round(v) : v.toFixed(1);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-5 relative overflow-hidden"
    >
      <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full blur-3xl ${accent ? "bg-highlight/30" : "bg-primary/25"}`} />
      <div className="relative">
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">{label}</div>
        <div className={`mt-2 font-display text-4xl font-semibold ${accent ? "text-highlight text-glow-highlight" : "text-primary text-glow-primary"}`}>
          {display}<span className="text-base text-muted-foreground font-mono">{suffix}</span>
        </div>
      </div>
    </motion.div>
  );
}

function Ring({ pct, accent }: { pct: number; accent?: boolean }) {
  const mv = useMotionValue(0);
  useEffect(() => { animate(mv, pct, { duration: 1.4, ease: "easeOut" }); }, [pct, mv]);
  const dash = useTransform(mv, (v) => `${(v / 100) * 282.74} 282.74`);
  const color = accent ? "var(--highlight)" : "var(--primary)";
  return (
    <svg viewBox="0 0 100 100" className="h-40 w-40">
      <circle cx="50" cy="50" r="45" stroke="color-mix(in oklab, var(--muted) 60%, transparent)" strokeWidth="6" fill="none" />
      <motion.circle
        cx="50" cy="50" r="45" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none"
        strokeDasharray={dash as any}
        transform="rotate(-90 50 50)"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </svg>
  );
}

function RingCard({ label, value, max, unit, accent }: { label: string; value: number; max: number; unit: string; accent?: boolean }) {
  const pct = Math.min(100, (value / Math.max(max, 1)) * 100);
  const v = useAnimatedNumber(value);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6 flex items-center gap-5">
      <div className="relative">
        <Ring pct={pct} accent={accent} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`font-display text-3xl font-semibold ${accent ? "text-highlight" : "text-primary"}`}>{Math.round(v)}</div>
        </div>
      </div>
      <div>
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">{label}</div>
        <div className="mt-1 font-display text-xl font-semibold">{value} {unit}</div>
        <div className="mt-1 font-mono text-[10px] text-muted-foreground">{Math.round(pct)}% of next tier</div>
      </div>
    </motion.div>
  );
}

function RankCard({ score }: { score: DiscoveryScore }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-primary/25 blur-3xl animate-[pulse-glow_4s_ease-in-out_infinite]" />
      <div className="relative">
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-primary">◬ Current Rank</div>
        <div className="mt-2 font-display text-3xl font-semibold text-glow-primary text-primary">{score.rank.name}</div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {score.rank.next ? `Next: ${score.rank.next}` : "Maximum tier achieved"}
        </div>
        <div className="mt-4 h-2 rounded-full bg-muted/30 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-highlight"
            initial={{ width: 0 }}
            animate={{ width: `${score.rank.pct}%` }}
            transition={{ duration: 1.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

const RANK_BADGES = [
  { name: "Drifter", icon: "◌" },
  { name: "Explorer", icon: "✦" },
  { name: "Pathfinder", icon: "✧" },
  { name: "Deep Diver", icon: "⬢" },
  { name: "Knowledge Hunter", icon: "❖" },
  { name: "Rabbit Hole Master", icon: "✺" },
];

function RankLadder({ current }: { current: number }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">⌖ Rank Ladder</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {RANK_BADGES.map((r, i) => {
          const unlocked = i <= current;
          return (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
              className={`glass-panel rounded-2xl p-4 text-center relative overflow-hidden ${unlocked ? "" : "opacity-50"}`}
            >
              {unlocked && <div className="absolute inset-0 bg-primary/10 animate-[pulse-glow_3s_ease-in-out_infinite]" />}
              <div className={`relative text-3xl mb-2 ${unlocked ? "text-primary text-glow-primary" : "text-muted-foreground"}`}>{r.icon}</div>
              <div className="relative font-mono text-[9px] tracking-[0.25em] uppercase">{r.name}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}