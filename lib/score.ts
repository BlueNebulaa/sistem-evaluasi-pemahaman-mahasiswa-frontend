export type ScoreScale = { min: number; max: number };

/** Lima tingkat warna/label skala skor (amber → teal), lihat DESIGN_GUIDE.md. */
export type ScoreLevel = 0 | 1 | 2 | 3 | 4;

const LEVEL_LABELS = ["Belum tepat", "Perlu banyak perbaikan", "Cukup", "Baik", "Sangat baik"] as const;

/** Memetakan skor ke tingkat 0–4 berapa pun rentang skala dari backend (jangan hardcode 0–4). */
export function scoreLevel(score: number, { min, max }: ScoreScale): ScoreLevel {
  if (max <= min) return 4;
  const ratio = Math.min(1, Math.max(0, (score - min) / (max - min)));
  return Math.round(ratio * 4) as ScoreLevel;
}

export function scoreLabel(score: number, scale: ScoreScale) {
  return LEVEL_LABELS[scoreLevel(score, scale)];
}

export function scoreOptions({ min, max }: ScoreScale) {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}
