import { motion } from "framer-motion";

export function Wormhole({ to }: { to: string }) {
  const rings = Array.from({ length: 14 });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] bg-background overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 [perspective:1200px]">
        {rings.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.1, opacity: 0, z: -800 }}
            animate={{ scale: 6, opacity: [0, 1, 0], z: 600 }}
            transition={{ duration: 1.1, delay: i * 0.04, ease: "easeIn" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{
              width: 200,
              height: 200,
              borderColor: i % 2 ? "var(--primary)" : "var(--secondary)",
              boxShadow: `0 0 80px ${i % 2 ? "var(--primary)" : "var(--secondary)"}`,
              transformStyle: "preserve-3d",
            }}
          />
        ))}
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.span
            key={`s-${i}`}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: (Math.random() - 0.5) * window.innerWidth * 2,
              y: (Math.random() - 0.5) * window.innerHeight * 2,
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.1, delay: Math.random() * 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 h-0.5 w-12 bg-primary rounded-full"
            style={{ boxShadow: "0 0 8px var(--primary)" }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center"
      >
        <div className="font-mono text-[10px] tracking-[0.4em] text-primary uppercase mb-2">
          ↬ Wormhole engaged
        </div>
        <div className="font-display text-3xl md:text-5xl font-semibold text-glow-primary">
          {to}
        </div>
      </motion.div>
    </motion.div>
  );
}