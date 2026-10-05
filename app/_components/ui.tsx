import type { ReactNode } from "react";
import { CheckCircleIcon } from "./icons";

export type Tone = "neutral" | "success" | "warning" | "info";

const PILL_TONES: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-600",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-indigo-50 text-indigo-600",
};

export function Pill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none ${PILL_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white ${className}`}>{children}</div>
  );
}

const CAPTION_TONES: Record<Tone, string> = {
  neutral: "text-slate-500",
  success: "text-emerald-600",
  warning: "text-amber-600",
  info: "text-indigo-600",
};

type StatCardProps = {
  label: string;
  value: number;
  max?: number;
  caption: string;
  captionTone?: Tone;
};

export function StatCard({ label, value, max = 100, caption, captionTone = "neutral" }: StatCardProps) {
  return (
    <Card className="px-5 py-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
        <span className="text-sm text-slate-500">/{max}</span>
      </p>
      <p className={`mt-2 text-xs ${CAPTION_TONES[captionTone]}`}>{caption}</p>
    </Card>
  );
}

export function StepChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-300 bg-white py-1 pl-1 pr-3 text-xs font-medium text-slate-900">
      <CheckCircleIcon className="size-[18px] text-emerald-500" />
      {label}
    </span>
  );
}

const TILE_TONES: Record<Exclude<Tone, "info">, { box: string; value: string }> = {
  neutral: { box: "bg-slate-50", value: "text-slate-900" },
  success: { box: "bg-slate-50", value: "text-emerald-600" },
  warning: { box: "bg-amber-50", value: "text-amber-600" },
};

type MetricTileProps = {
  label: string;
  field: string;
  value: ReactNode;
  tone?: Exclude<Tone, "info">;
  className?: string;
};

/** Kotak metrik kecil: label, nilai, dan nama field JSON sumbernya. */
export function MetricTile({ label, field, value, tone = "neutral", className = "" }: MetricTileProps) {
  const styles = TILE_TONES[tone];
  return (
    <div className={`rounded-lg px-3 py-2.5 ${styles.box} ${className}`}>
      <p className="text-[11px] text-slate-500">{label}</p>
      <div className={`mt-1 text-lg font-semibold leading-tight ${styles.value}`}>{value}</div>
      <p className="mt-1 break-all font-mono text-[10px] leading-tight text-slate-400">{field}</p>
    </div>
  );
}

type ScoreMeterProps = {
  score: number;
  minScore: number;
  maxScore: number;
  tone: "success" | "warning" | "danger";
};

const METER_TONES: Record<ScoreMeterProps["tone"], string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

/** Bar tersegmentasi, satu segmen per poin skala skor. */
export function ScoreMeter({ score, minScore, maxScore, tone }: ScoreMeterProps) {
  const segments = Math.max(maxScore - minScore, 1);
  const filled = score - minScore;
  return (
    <span className="flex gap-1" aria-hidden>
      {Array.from({ length: segments }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 w-3.5 rounded-full ${index < filled ? METER_TONES[tone] : "bg-slate-200"}`}
        />
      ))}
    </span>
  );
}
