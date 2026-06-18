export interface TimelineEvent {
  year: number;
  title: string;
  detail: string;
}

const CURATED: Record<string, TimelineEvent[]> = {
  "artificial intelligence": [
    { year: 1950, title: "Turing Test", detail: "Alan Turing proposes the imitation game." },
    { year: 1956, title: "Dartmouth Workshop", detail: "The field of AI is named." },
    { year: 1980, title: "Expert Systems", detail: "Rule-based AI enters industry." },
    { year: 1997, title: "Deep Blue", detail: "IBM's chess engine beats Kasparov." },
    { year: 2012, title: "Deep Learning Boom", detail: "AlexNet wins ImageNet by a landslide." },
    { year: 2017, title: "Transformers", detail: "Attention Is All You Need is published." },
    { year: 2022, title: "Generative AI", detail: "ChatGPT brings LLMs to the public." },
    { year: 2026, title: "Modern AI Ecosystem", detail: "Agents, multimodal models, AI-native apps." },
  ],
  "neural network": [
    { year: 1958, title: "Perceptron", detail: "Rosenblatt builds the first learning machine." },
    { year: 1986, title: "Backpropagation", detail: "Rumelhart, Hinton, Williams formalize training." },
    { year: 1998, title: "LeNet-5", detail: "Convolutional nets read handwritten digits." },
    { year: 2012, title: "AlexNet", detail: "GPU-trained CNNs dominate vision." },
    { year: 2015, title: "ResNet", detail: "Residual connections enable very deep networks." },
    { year: 2017, title: "Transformer", detail: "Attention replaces recurrence." },
    { year: 2023, title: "Frontier Models", detail: "Trillion-parameter foundation models." },
  ],
  "black hole": [
    { year: 1783, title: "Dark Star", detail: "Michell imagines stars whose light cannot escape." },
    { year: 1916, title: "Schwarzschild Solution", detail: "First exact solution to general relativity." },
    { year: 1967, title: "Named", detail: "Wheeler coins the term black hole." },
    { year: 1974, title: "Hawking Radiation", detail: "Black holes evaporate, slowly." },
    { year: 2019, title: "First Image", detail: "Event Horizon Telescope captures M87*." },
    { year: 2022, title: "Sgr A* Image", detail: "Our galactic center, finally seen." },
  ],
  "internet": [
    { year: 1969, title: "ARPANET", detail: "First message sent between two nodes." },
    { year: 1983, title: "TCP/IP", detail: "The protocol that unifies the network." },
    { year: 1991, title: "World Wide Web", detail: "Berners-Lee publishes the first website." },
    { year: 2004, title: "Social Web", detail: "Facebook, Flickr, the participatory era." },
    { year: 2007, title: "Mobile Internet", detail: "iPhone puts the web in every pocket." },
    { year: 2020, title: "Cloud-Native", detail: "Edge, serverless, ubiquitous APIs." },
  ],
};

export function timelineFor(topic: string): TimelineEvent[] {
  const key = topic.toLowerCase();
  for (const k of Object.keys(CURATED)) {
    if (key.includes(k)) return CURATED[k];
  }
  return synthesizeTimeline(topic);
}

function synthesizeTimeline(topic: string): TimelineEvent[] {
  const seed = [...topic].reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = 1800 + (seed % 120);
  const span = [0, 30, 70, 110, 150, 180, 210].map((d) => base + d);
  const beats = [
    "Origins", "First Description", "Foundational Work",
    "Cultural Spread", "Modern Synthesis", "Renaissance", "Future Horizons",
  ];
  return span.map((year, i) => ({
    year: Math.min(year, 2026),
    title: beats[i],
    detail: `A milestone in the evolution of ${topic}.`,
  }));
}