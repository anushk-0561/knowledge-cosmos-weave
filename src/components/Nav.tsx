import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between pointer-events-auto">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-md group-hover:bg-primary/60 transition" />
            <div className="absolute inset-1 rounded-full border border-primary/60 bg-background flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            </div>
          </div>
          <span className="font-display font-semibold tracking-[0.2em] text-sm uppercase">
            Rabbit<span className="text-primary">Hole</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 font-mono text-[11px] tracking-[0.2em] uppercase">
          {[
            { to: "/", label: "Universe" },
            { to: "/history", label: "Trails" },
            { to: "/achievements", label: "Badges" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
              activeProps={{ className: "text-primary bg-primary/10" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}