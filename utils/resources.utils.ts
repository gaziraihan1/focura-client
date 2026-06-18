export function splitDescriptionIntoSentences(description: string): string[] {
  return description
    .split(".")
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0)
    .map((sentence) => `${sentence}.`);
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const CATEGORY_ACCENTS = [
  { text: "text-chart-1", bg: "bg-chart-1/10", border: "border-chart-1/30" },
  { text: "text-chart-2", bg: "bg-chart-2/10", border: "border-chart-2/30" },
  { text: "text-chart-3", bg: "bg-chart-3/10", border: "border-chart-3/30" },
  { text: "text-chart-4", bg: "bg-chart-4/10", border: "border-chart-4/30" },
  { text: "text-chart-5", bg: "bg-chart-5/10", border: "border-chart-5/30" },
] as const;

export function getCategoryAccent(category: string) {
  let hash = 0;

  for (let i = 0; i < category.length; i++) {
    hash = (hash << 5) - hash + category.charCodeAt(i);
    hash |= 0;
  }

  return CATEGORY_ACCENTS[Math.abs(hash) % CATEGORY_ACCENTS.length];
}