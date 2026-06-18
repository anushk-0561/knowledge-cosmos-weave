const HKEY = "rh.history";
const AKEY = "rh.achievements";

export interface VisitEntry {
  topic: string;
  at: number;
  depth: number;
  from?: string;
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
  if (typeof window !== "undefined") localStorage.removeItem(HKEY);
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