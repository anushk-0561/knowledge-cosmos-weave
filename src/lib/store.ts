const HKEY = "rh.history";
const AKEY = "rh.achievements";
const CKEY = "rh.connections";
const SKEY = "rh.sessions";

export interface VisitEntry {
  topic: string;
  at: number;
  depth: number;
  from?: string;
}

export interface Connection { a: string; b: string; at: number; }

export function getConnections(): Connection[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CKEY) ?? "[]"); } catch { return []; }
}

export function pushConnection(a: string, b: string) {
  if (typeof window === "undefined" || !a || !b || a === b) return;
  const list = getConnections();
  const key = [a, b].sort().join("§");
  if (list.some((c) => [c.a, c.b].sort().join("§") === key)) return;
  list.push({ a, b, at: Date.now() });
  localStorage.setItem(CKEY, JSON.stringify(list.slice(-500)));
}

export function getSessions(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(SKEY) ?? "0", 10) || 0;
}

export function bumpSession() {
  if (typeof window === "undefined") return;
  const last = parseInt(sessionStorage.getItem("rh.sessionBumped") ?? "0", 10);
  if (last) return;
  sessionStorage.setItem("rh.sessionBumped", "1");
  localStorage.setItem(SKEY, String(getSessions() + 1));
}

export interface TopicStat { topic: string; count: number; lastAt: number; }
export function getTopicStats(): TopicStat[] {
  const h = getHistory();
  const map = new Map<string, TopicStat>();
  for (const e of h) {
    const s = map.get(e.topic) ?? { topic: e.topic, count: 0, lastAt: 0 };
    s.count += 1;
    s.lastAt = Math.max(s.lastAt, e.at);
    map.set(e.topic, s);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function longestChain(): number {
  const h = getHistory();
  let best = 0, cur = 0, prev = 0;
  for (const e of h) {
    if (e.at - prev < 1000 * 60 * 10) cur += 1; else cur = 1;
    best = Math.max(best, cur);
    prev = e.at;
  }
  return best;
}

export interface DiscoveryScore {
  topics: number;
  deepest: number;
  longestChain: number;
  connections: number;
  rarest: string;
  sessions: number;
  avgDepth: number;
  total: number;
  rank: { name: string; index: number; next?: string; pct: number };
}

const RANKS = ["Drifter", "Explorer", "Pathfinder", "Deep Diver", "Knowledge Hunter", "Rabbit Hole Master"];
const RANK_THRESHOLDS = [0, 5, 15, 30, 60, 120];

export function getDiscoveryScore(): DiscoveryScore {
  const h = getHistory();
  const stats = getTopicStats();
  const conns = getConnections();
  const topics = stats.length;
  const deepest = h.reduce((m, e) => Math.max(m, e.depth), 0);
  const avgDepth = h.length ? h.reduce((s, e) => s + e.depth, 0) / h.length : 0;
  const rarest = stats.length ? stats[stats.length - 1].topic : "—";
  const total = topics * 10 + deepest * 8 + conns.length * 3 + longestChain() * 5;
  let rankIdx = 0;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) if (topics >= RANK_THRESHOLDS[i]) rankIdx = i;
  const next = RANKS[rankIdx + 1];
  const span = (RANK_THRESHOLDS[rankIdx + 1] ?? RANK_THRESHOLDS[rankIdx]) - RANK_THRESHOLDS[rankIdx];
  const into = topics - RANK_THRESHOLDS[rankIdx];
  const pct = next ? Math.min(100, Math.round((into / Math.max(span, 1)) * 100)) : 100;
  return {
    topics, deepest, longestChain: longestChain(), connections: conns.length,
    rarest, sessions: getSessions(), avgDepth: Math.round(avgDepth * 10) / 10,
    total, rank: { name: RANKS[rankIdx], index: rankIdx, next, pct },
  };
}

export function encodePath(topics: string[]): string {
  return topics.map((t) => encodeURIComponent(t)).join("~");
}
export function decodePath(s: string): string[] {
  return s.split("~").map((p) => decodeURIComponent(p)).filter(Boolean);
}

export function getHistory(): VisitEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HKEY) ?? "[]");
  } catch {
    return [];
  }
}

export function pushHistory(entry: VisitEntry) {
  if (typeof window === "undefined") return;
  const h = getHistory();
  if (h[h.length - 1]?.topic === entry.topic) return;
  h.push(entry);
  localStorage.setItem(HKEY, JSON.stringify(h.slice(-200)));
  updateAchievements(h.length, Math.max(...h.map((e) => e.depth), 0));
}

export function clearHistory() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(HKEY);
    localStorage.removeItem(CKEY);
  }
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  threshold: number;
  unit: "visits" | "depth";
  unlocked: boolean;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "explorer", name: "Explorer", description: "Visit your first 3 worlds", threshold: 3, unit: "visits", unlocked: false },
  { id: "diver", name: "Deep Diver", description: "Reach depth level 3", threshold: 3, unit: "depth", unlocked: false },
  { id: "hunter", name: "Knowledge Hunter", description: "Explore 15 unique topics", threshold: 15, unit: "visits", unlocked: false },
  { id: "master", name: "Rabbit Hole Master", description: "Travel 50 worlds deep", threshold: 50, unit: "visits", unlocked: false },
  { id: "abyss", name: "Into the Abyss", description: "Reach depth level 7", threshold: 7, unit: "depth", unlocked: false },
];

export function getAchievements(): Achievement[] {
  if (typeof window === "undefined") return DEFAULT_ACHIEVEMENTS;
  try {
    const stored: Achievement[] = JSON.parse(localStorage.getItem(AKEY) ?? "null");
    if (!stored) return DEFAULT_ACHIEVEMENTS;
    return DEFAULT_ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: stored.find((s) => s.id === a.id)?.unlocked ?? false,
    }));
  } catch {
    return DEFAULT_ACHIEVEMENTS;
  }
}

function updateAchievements(visits: number, depth: number) {
  const list = getAchievements().map((a) => ({
    ...a,
    unlocked: a.unlocked || (a.unit === "visits" ? visits >= a.threshold : depth >= a.threshold),
  }));
  localStorage.setItem(AKEY, JSON.stringify(list));
}