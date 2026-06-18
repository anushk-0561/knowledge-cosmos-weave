import { motion } from "framer-motion";
import type { WikiSummary, RelatedTopic } from "@/lib/wiki";

interface Props {
  loading: boolean;
  summary: WikiSummary | null;
  related: RelatedTopic[];
  depth: number;
  onSelect: (t: string) => void;
  onClose: () => void;
  onSurprise: () => void;
}

export function KnowledgePanel({ loading, summary, related, depth, onSelect, onClose, onSurprise }: Props) {
  return (
    <motion.aside
      initial={{ x: 80, opacity: 0, filter: "blur(8px)" }}
      animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="pointer-events-auto absolute right-0 top-0 bottom-0 z-30 w-full md:w-[440px] p-4 md:p-6"
    >
      <div className="glass-panel rounded-3xl h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary">
            ◉ Depth {String(depth).padStart(2, "0")} · Node
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-border hover:border-primary/60 hover:bg-primary/10 transition flex items-center justify-center text-muted-foreground hover:text-primary"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 mt-3 flex-1 overflow-y-auto scrollbar-thin">
          {loading && <SkeletonPanel />}
          {!loading && summary && (
            <>
              <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight">
                {summary.title}
              </h2>
              {summary.description && (
                <p className="mt-2 font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                  {summary.description}
                </p>
              )}
              {summary.thumbnail?.source && (
                <div className="relative mt-5 rounded-2xl overflow-hidden border border-border">
                  <img src={summary.thumbnail.source} alt={summary.title} className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>
              )}
              <p className="mt-5 text-foreground/85 text-[15px] leading-relaxed">
                {summary.extract}
              </p>

              <div className="mt-6">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                  ⟡ Connected Worlds
                </div>
                <div className="flex flex-wrap gap-2">
                  {related.slice(0, 12).map((r) => (
                    <button
                      key={r.title}
                      onClick={() => onSelect(r.title)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background/40 hover:border-primary/60 hover:bg-primary/10 transition text-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary group-hover:shadow-[0_0_8px_var(--primary)]" />
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {!loading && !summary && (
            <div className="text-muted-foreground mt-10">
              No transmissions found for this signal. Try another topic.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border flex gap-2">
          {summary?.content_urls?.desktop?.page && (
            <a
              href={summary.content_urls.desktop.page}
              target="_blank"
              rel="noreferrer"
              className="flex-1 btn-magnetic !py-2.5 text-center"
            >
              Explore further ↗
            </a>
          )}
          <button
            onClick={onSurprise}
            className="px-4 py-2.5 rounded-full border border-highlight/40 font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-highlight/10 transition"
            style={{ color: "var(--highlight)" }}
          >
            ✦ Surprise
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

function SkeletonPanel() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-2/3 rounded bg-muted/40" />
      <div className="h-3 w-1/3 rounded bg-muted/30" />
      <div className="h-44 w-full rounded-2xl bg-muted/20" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-muted/30" />
        <div className="h-3 w-11/12 rounded bg-muted/30" />
        <div className="h-3 w-10/12 rounded bg-muted/30" />
        <div className="h-3 w-9/12 rounded bg-muted/30" />
      </div>
    </div>
  );
}