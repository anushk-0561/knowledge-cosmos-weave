import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { getAchievements, type Achievement } from "@/lib/store";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Badges — Rabbit Hole" },
      { name: "description", content: "Unlock badges as you fall deeper into the rabbit hole." },
    ],
  }),
  component: AchPage,
});

function AchPage() {
  const [list, setList] = useState<Achievement[]>([]);
  useEffect(() => setList(getAchievements()), []);

  return (
    <main className="relative min-h-screen pt-28 pb-20 px-6">
      <Nav />
      <div className="mx-auto max-w-6xl">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-2">◬ Discoveries</div>
        <h1 className="font-display text-5xl md:text-6xl font-semibold">
          Earn your <span className="text-glow-highlight" style={{ color: "var(--highlight)" }}>badges</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Every dive deeper unlocks new constellations in your explorer profile.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`glass-panel rounded-2xl p-6 relative overflow-hidden ${a.unlocked ? "" : "opacity-60"}`}
            >
              <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl ${a.unlocked ? "bg-primary/40" : "bg-muted/20"}`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center text-lg ${a.unlocked ? "border-primary text-primary shadow-[0_0_24px_var(--primary)]" : "border-border text-muted-foreground"}`}>
                    {a.unlocked ? "✦" : "◌"}
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                    {a.threshold} {a.unit}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{a.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                <div className="mt-4 font-mono text-[10px] tracking-[0.3em] uppercase">
                  {a.unlocked ? (
                    <span className="text-primary">⬢ Unlocked</span>
                  ) : (
                    <span className="text-muted-foreground">Locked</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}