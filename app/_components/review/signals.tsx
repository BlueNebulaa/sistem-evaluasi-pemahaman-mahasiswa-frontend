import {
  BookOpen,
  CircleCheck,
  FileText,
  Headphones,
  Laptop,
  Package,
  Smartphone,
  TriangleAlert,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatNumber, formatSpokenTime, formatTimestamp } from "@/lib/format";
import type { DetectedObject, SpeechStats as Speech } from "@/lib/normalize-review";

const OBJECT_ICONS: Record<string, LucideIcon> = {
  "cell phone": Smartphone,
  phone: Smartphone,
  tablet: Smartphone,
  book: BookOpen,
  laptop: Laptop,
  person: User,
  paper: FileText,
  headphones: Headphones,
  earphone: Headphones,
};

/** Bar persentase dengan garis ambang normal; di atas ambang berwarna amber + ikon + teks. */
export function SignalMeter({
  label,
  value,
  threshold,
  needsReview,
}: {
  label: string;
  value: number;
  threshold: number | null;
  needsReview: boolean;
}) {
  const over = threshold !== null ? value > threshold : needsReview;
  const valueText = `${formatNumber(value, 1)}%`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-body-sm">
        <span className="font-medium text-fg">{label}</span>
        <span className={cn("inline-flex items-center gap-1 font-mono tabular-nums", over ? "font-semibold text-warning" : "text-fg")}>
          {over && <TriangleAlert aria-hidden className="size-4" />}
          {valueText}
        </span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${valueText}${threshold !== null ? `, ambang normal ${threshold}%` : ""}${over ? ", di atas ambang" : ""}`}
        className="relative mt-1.5 h-2 rounded-full bg-surface-muted"
      >
        <div
          className={cn("absolute inset-0 origin-left rounded-full", over ? "bg-warning" : "bg-fg-muted/50")}
          style={{ transform: `scaleX(${Math.min(100, value) / 100})` }}
        />
        {threshold !== null && (
          <div aria-hidden className="absolute -inset-y-1 w-0.5 rounded-full bg-fg" style={{ left: `${threshold}%` }} />
        )}
      </div>
      <p className="mt-1 text-caption text-fg-muted">
        {threshold !== null ? `Ambang normal ${threshold}%` : "Ambang normal belum tersedia"}
        {over && " · di atas ambang"}
      </p>
    </div>
  );
}

/** Chip per objek terdeteksi; klik chip = lompat ke detik deteksi bila timestamp tersedia. */
export function ObjectFlagList({ objects, onSeek }: { objects: DetectedObject[]; onSeek: (sec: number) => void }) {
  if (objects.length === 0) {
    return (
      <p className="flex items-center gap-2 text-body-sm text-fg-muted">
        <CircleCheck aria-hidden className="size-4 text-success" />
        Tidak ada objek mencurigakan
      </p>
    );
  }

  const chip = "inline-flex h-8 items-center gap-1.5 rounded-sm border border-warning/40 bg-warning-soft px-2.5 text-body-sm font-medium text-warning";

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Objek terdeteksi">
      {objects.map((o) => {
        const Icon = OBJECT_ICONS[o.key.toLowerCase()] ?? Package;
        return (
          <li key={o.key}>
            {o.timestampSec !== null ? (
              <button
                type="button"
                onClick={() => onSeek(o.timestampSec as number)}
                aria-label={`${o.label} terdeteksi pada ${formatSpokenTime(o.timestampSec)}. Lompat ke detik ini`}
                className={cn(chip, "transition-colors duration-(--motion-fast) ease-standard hover:border-warning")}
              >
                <Icon aria-hidden className="size-4" />
                {o.label}
                <span className="font-mono text-caption tabular-nums">{formatTimestamp(o.timestampSec)}</span>
              </button>
            ) : (
              <span className={chip}>
                <Icon aria-hidden className="size-4" />
                {o.label}
                <span className="text-caption font-normal">waktu belum tersedia</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** WPM, tempo, jeda, kata pengisi. Informasi pendukung, sengaja tanpa warna penilaian. */
export function SpeechStats({ speech }: { speech: Speech }) {
  const items = [
    { label: "Kecepatan", value: formatNumber(speech.wordsPerMinute), unit: "kata/menit" },
    { label: "Tempo", value: speech.tempo, unit: "" },
    { label: "Total jeda", value: formatNumber(speech.totalSilenceSec, 1), unit: "detik" },
    { label: "Kata pengisi", value: formatNumber(speech.fillerWordCount), unit: "kali" },
  ];
  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-md bg-surface-muted px-3 py-2">
          <dt className="text-caption text-fg-muted">{item.label}</dt>
          <dd className="mt-0.5 font-mono text-body font-semibold tabular-nums text-fg">
            {item.value}
            {item.unit && <span className="ml-1 font-sans text-caption font-normal text-fg-muted">{item.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
