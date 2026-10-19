import { cn } from "@/lib/cn";
import { scoreLabel, scoreLevel, type ScoreLevel, type ScoreScale } from "@/lib/score";

const LEVEL_CLASSES: Record<ScoreLevel, string> = {
  0: "bg-score-0 text-on-score-0",
  1: "bg-score-1 text-on-score-1",
  2: "bg-score-2 text-on-score-2",
  3: "bg-score-3 text-on-score-3",
  4: "bg-score-4 text-on-score-4",
};

const SIZES = {
  sm: "h-7 gap-1.5 px-2 text-caption",
  lg: "h-10 gap-2 px-3 text-body-sm font-medium",
};

/** Angka skor selalu di dalam chip, dengan label pendek dan warna dari skala amber → teal. */
export function ScoreChip({
  score,
  scale,
  size = "sm",
  showLabel = true,
  className,
}: {
  score: number;
  scale: ScoreScale;
  size?: keyof typeof SIZES;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-sm",
        LEVEL_CLASSES[scoreLevel(score, scale)],
        SIZES[size],
        className,
      )}
    >
      <span className="sr-only">Skor </span>
      <span className="font-mono font-semibold tabular-nums">{score}</span>
      <span className="sr-only"> dari {scale.max}</span>
      {showLabel && <span>{scoreLabel(score, scale)}</span>}
    </span>
  );
}
