import {
  ArrowRight,
  CalendarClock,
  Circle,
  CircleCheck,
  LoaderCircle,
  MessageSquareText,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { Assessment, AssessmentStatus } from "@/lib/mock-data";
import { Badge } from "../ui/badges";
import { ButtonLink } from "../ui/button";
import { Card } from "../ui/card";

const STATUS_META: Record<
  AssessmentStatus,
  { label: string; tone: "neutral" | "info" | "success"; icon: LucideIcon; spin?: boolean }
> = {
  "not-started": { label: "Belum dikerjakan", tone: "neutral", icon: Circle },
  processing: { label: "Diproses", tone: "info", icon: LoaderCircle, spin: true },
  "result-ready": { label: "Hasil tersedia", tone: "success", icon: CircleCheck },
};

function Action({ assessment }: { assessment: Assessment }) {
  const base = `/asesmen/${assessment.id}`;
  const className = "w-full sm:w-auto";
  if (assessment.status === "processing") {
    return (
      <ButtonLink href={`${base}/status`} size="lg" className={className}>
        Lihat status
      </ButtonLink>
    );
  }
  if (assessment.status === "result-ready") {
    return (
      <ButtonLink href={`${base}/hasil`} variant="primary" size="lg" className={className}>
        Lihat hasil
        <ArrowRight aria-hidden />
      </ButtonLink>
    );
  }
  return (
    <ButtonLink href={`${base}/panduan`} variant="primary" size="lg" className={className}>
      Mulai asesmen
      <ArrowRight aria-hidden />
    </ButtonLink>
  );
}

export function AssessmentCard({ assessment }: { assessment: Assessment }) {
  const { label, ...status } = STATUS_META[assessment.status];
  return (
    <Card density="student" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption text-fg-muted">
            {assessment.course} · {assessment.className}
          </p>
          <h3 className="mt-1 text-h3 text-fg">{assessment.topic}</h3>
        </div>
        <Badge {...status}>{label}</Badge>
      </div>

      <dl className="flex flex-wrap gap-x-6 gap-y-2 text-body-sm text-fg-muted">
        <div className="flex items-center gap-2">
          <CalendarClock aria-hidden className="size-4" />
          <dt className="sr-only">Tenggat</dt>
          <dd>Tenggat {formatDateTime(assessment.dueAt)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquareText aria-hidden className="size-4" />
          <dt className="sr-only">Jumlah pertanyaan</dt>
          <dd>{assessment.questions.length} pertanyaan</dd>
        </div>
        <div className="flex items-center gap-2">
          <Timer aria-hidden className="size-4" />
          <dt className="sr-only">Durasi maksimal</dt>
          <dd>Maks. {assessment.maxDurationMin} menit</dd>
        </div>
      </dl>

      <div>
        <Action assessment={assessment} />
      </div>
    </Card>
  );
}
