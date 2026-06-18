import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { clearHistory, getHistory, getConnections, encodePath, type VisitEntry, type Connection } from "@/lib/store";
import { Constellation } from "@/components/three/Constellation";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Knowledge Constellation — Rabbit Hole" },
      { name: "description", content: "A living 3D map of every world you've explored." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [history, setHistory] = useState<VisitEntry[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    setHistory(getHistory());
    setConnections(getConnections());
  }, []);

  const worlds = history.length;
  const unique = new Set(history.map((h) => h.topic)).size;
  const deepest = history.reduce((m, h) => Math.max(m, h.depth), 0);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <Nav />
      <div className="absolute inset-0">
        {worlds > 0 ? (
          <Constellation
            entries={history}
            connections={connections}
            onSelect={(topic) => navigate({ to: "/explore/$topic", params: { topic: encodeURIComponent(topic) } })}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">⟡ Empty Space</div>
              <Link to="/" className="btn-magnetic">Launch your first journey ↗</Link>
            </div>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,var(--background)_98%)]" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-6 top-24 z-10 max-w-sm pointer-events-none"
      >
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-2">◴ Knowledge Constellation</div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight">
          Your personal <span className="text-glow-primary text-primary">universe</span> of curiosity
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Drag to rotate. Scroll to zoom. Click a star to revisit.</p>
      </motion.div>

      <div className="absolute right-6 top-24 z-10 grid grid-cols-3 gap-2 w-[min(520px,calc(100%-3rem))]">
        <Stat label="Worlds" value={worlds} />
        <Stat label="Unique" value={unique} />
        <Stat label="Depth" value={deepest} accent />
      </div>

      {worlds > 0 && (
        <div className="absolute bottom-6 left-6 z-10 flex gap-2 pointer-events-auto">
          <Link
            to="/universe/$path"
            params={{ path: encodePath([...new Set(history.map((h) => h.topic))].slice(-12)) }}
            className="glass-panel rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-primary transition"
          >
            ↗ Share universe
          </Link>
          <button
            onClick={() => { clearHistory(); setHistory([]); setConnections([]); }}
            className="glass-panel rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-highlight transition"
          >
            ✕ Erase trails
          </button>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-3xl font-semibold ${accent ? "text-highlight text-glow-highlight" : "text-primary text-glow-primary"}`}>
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );
}