import {
  CircleAlert,
  CircleCheck,
  Eye,
  LoaderCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ReviewStatus } from "@/lib/decision";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "ai";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-muted text-fg-muted",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  ai: "bg-ai-soft text-ai",
};

/** Pill status: selalu ikon + teks, tidak hanya warna. */
export function Badge({
  tone,
  icon: Icon,
  spin,
  children,
  className,
}: {
  tone: Tone;
  icon: LucideIcon;
  spin?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-caption",
        TONES[tone],
        className,
      )}
    >
      <Icon aria-hidden className={cn("size-4", spin && "animate-spin")} />
      {children}
    </span>
  );
}

const STATUS: Record<ReviewStatus, { label: string; tone: Tone; icon: LucideIcon; spin?: boolean }> = {
  "needs-review": { label: "Perlu Tinjauan Dosen", tone: "warning", icon: Eye },
  approved: { label: "Disetujui", tone: "success", icon: CircleCheck },
  processing: { label: "Sedang Diproses", tone: "info", icon: LoaderCircle, spin: true },
  failed: { label: "Gagal", tone: "danger", icon: CircleAlert },
};

export const STATUS_LABELS: Record<ReviewStatus, string> = {
  "needs-review": STATUS["needs-review"].label,
  approved: STATUS.approved.label,
  processing: STATUS.processing.label,
  failed: STATUS.failed.label,
};

export function StatusBadge({ status, className }: { status: ReviewStatus; className?: string }) {
  const { label, ...rest } = STATUS[status];
  return (
    <Badge {...rest} className={className}>
      {label}
    </Badge>
  );
}

/** Satu-satunya pemakaian warna ungu: penanda hasil penilaian AI. */
export function AIBadge({ reviewed = false, className }: { reviewed?: boolean; className?: string }) {
  return (
    <Badge tone="ai" icon={Sparkles} className={className}>
      {reviewed ? "Dinilai AI · ditinjau dosen" : "Dinilai AI"}
    </Badge>
  );
}
