import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { timelineFor } from "@/lib/timeline";

export function TimeMachine({ topic }: { topic: string }) {
  const events = useMemo(() => timelineFor(topic), [topic]);
  const [idx, setIdx] = useState(events.length - 1);
  const ev = events[idx];
  const min = events[0].year, max = events[events.length - 1].year;
  const pct = ((ev.year - min) / Math.max(max - min, 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[min(720px,calc(100%-2rem))]"
    >
      <div className="glass-panel rounded-2xl px-5 py-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-primary">◴ Time Machine</div>
            <div className="mt-1 font-display text-2xl font-semibold text-glow-primary text-primary">{ev.year}</div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={ev.year}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35 }}
              className="text-right max-w-[60%]"
            >
              <div className="font-display text-sm font-semibold">{ev.title}</div>
              <div className="font-mono text-[10px] text-muted-foreground leading-snug mt-0.5">{ev.detail}</div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative h-2 rounded-full bg-muted/30 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-highlight"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <input
            type="range"
            min={0}
            max={events.length - 1}
            value={idx}
            onChange={(e) => setIdx(parseInt(e.target.value, 10))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Timeline slider"
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[9px] tracking-[0.25em] uppercase text-muted-foreground">
          {events.map((e, i) => (
            <button
              key={e.year}
              onClick={() => setIdx(i)}
              className={`transition ${i === idx ? "text-primary text-glow-primary" : "hover:text-foreground"}`}
            >
              {e.year}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}