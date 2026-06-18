export interface WikiSummary {
  title: string;
  extract: string;
  description?: string;
  thumbnail?: { source: string };
  content_urls?: { desktop: { page: string } };
}

export interface RelatedTopic {
  title: string;
  type: NodeType;
}

export type NodeType = "planet" | "star" | "crystal" | "core" | "blackhole";

const TYPES: NodeType[] = ["planet", "star", "crystal", "core", "blackhole"];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function typeFor(title: string): NodeType {
  return TYPES[hash(title) % TYPES.length];
}

export async function fetchSummary(topic: string): Promise<WikiSummary | null> {
  const t = encodeURIComponent(topic.trim().replace(/\s+/g, "_"));
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${t}`, {
      headers: { accept: "application/json" },
    });
    if (!r.ok) return null;
    return (await r.json()) as WikiSummary;
  } catch {
    return null;
  }
}

export async function fetchRelated(topic: string, limit = 14): Promise<RelatedTopic[]> {
  const t = encodeURIComponent(topic.trim().replace(/\s+/g, "_"));
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=links&titles=${t}&pllimit=${limit * 3}&plnamespace=0`;
    const r = await fetch(url);
    if (!r.ok) return [];
    const data = await r.json();
    const pages = data?.query?.pages ?? {};
    const first: any = Object.values(pages)[0];
    const links: { title: string }[] = first?.links ?? [];
    const seen = new Set<string>();
    const out: RelatedTopic[] = [];
    for (const l of links) {
      const title = l.title;
      if (!title || seen.has(title)) continue;
      if (/^(List of|ISBN|Wikipedia:|Help:|File:|Category:)/i.test(title)) continue;
      seen.add(title);
      out.push({ title, type: typeFor(title) });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

const RANDOM_TOPICS = [
  "Black hole", "Quantum entanglement", "Ancient Rome", "Octopus", "Hangul",
  "Bioluminescence", "String theory", "Mycelium", "Aurora", "Tardigrade",
  "Renaissance", "Synesthesia", "Fractal", "Big Bang", "Mythology",
  "Origami", "Neural network", "Volcano", "Antarctica", "Telescope",
  "Samurai", "Polyrhythm", "Bonsai", "Cathedral", "Nebula",
];

export function randomTopic(): string {
  return RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
}