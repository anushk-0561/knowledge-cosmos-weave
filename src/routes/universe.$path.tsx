import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Constellation } from "@/components/three/Constellation";
import { decodePath } from "@/lib/store";
import type { VisitEntry, Connection } from "@/lib/store";

export const Route = createFileRoute("/universe/$path")({
  head: ({ params }) => {
    const list = decodePath(params.path);
    const title = list.slice(0, 3).join(" · ");
    return {
      meta: [
        { title: `${title} — A Shared Universe` },
        { name: "description", content: `An immersive 3D knowledge constellation: ${list.join(", ")}` },
        { property: "og:title", content: `${title} — Rabbit Hole Universe` },
        { property: "og:description", content: `Explore a shared knowledge galaxy of ${list.length} interconnected worlds.` },
      ],
    };
  },
  component: SharedUniverse,
});

function SharedUniverse() {
  const { path } = Route.useParams();
  const navigate = useNavigate();
  const topics = useMemo(() => decodePath(path), [path]);

  const { entries, connections } = useMemo(() => {
    const now = Date.now();
    const entries: VisitEntry[] = topics.map((t, i) => ({ topic: t, at: now - (topics.length - i) * 60000, depth: i + 1 }));
    const connections: Connection[] = [];
    for (let i = 0; i < topics.length - 1; i++) connections.push({ a: topics[i], b: topics[i + 1], at: now });
    return { entries, connections };
  }, [topics]);

  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Universe link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: "Rabbit Hole Universe", url });
      } catch { /* user cancelled */ }
    } else copy();
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <Nav />
      <div className="absolute inset-0">
        <Constellation
          entries={entries}
          connections={connections}
          onSelect={(t) => navigate({ to: "/explore/$topic", params: { topic: encodeURIComponent(t) } })}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,var(--background)_98%)]" />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute left-6 top-24 z-10 max-w-md pointer-events-none">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-2">↗ Shared Universe</div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight">
          A galaxy of <span className="text-glow-primary text-primary">{topics.length}</span> interconnected ideas
        </h1>
        <p className="mt-3 font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          {topics.slice(0, 4).join(" · ")}{topics.length > 4 ? " · …" : ""}
        </p>
      </motion.div>

      <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex gap-2">
          <button onClick={copy} className="glass-panel rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-primary transition">
            {copied ? "✓ Copied" : "⧉ Copy link"}
          </button>
          <button onClick={share} className="glass-panel rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-primary transition">
            ↗ Share
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Explore this knowledge universe")}&url=${encodeURIComponent(url)}`}
            target="_blank" rel="noreferrer"
            className="glass-panel rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-primary transition"
          >
            𝕏 Post
          </a>
        </div>
        <Link to="/" className="glass-panel rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-primary transition">
          ✦ Launch your own
        </Link>
      </div>
    </main>
  );
}