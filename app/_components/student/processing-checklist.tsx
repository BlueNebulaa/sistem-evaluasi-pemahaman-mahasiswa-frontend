"use client";

import { Circle, CircleCheck, Clock3, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type StageId = "upload" | "extract" | "transcribe" | "score" | "speech" | "integrity" | "review";
type StageStatus = "pending" | "active" | "done" | "waiting";
type Stage = { id: StageId; label: string; after: StageId[] };

const STAGES: Record<StageId, Stage> = {
  upload: { id: "upload", label: "Mengunggah video", after: [] },
  extract: { id: "extract", label: "Mengekstrak audio dan frame", after: ["upload"] },
  transcribe: { id: "transcribe", label: "Mentranskripsi jawaban", after: ["extract"] },
  score: { id: "score", label: "Menilai pemahaman materi", after: ["transcribe"] },
  speech: { id: "speech", label: "Menganalisis cara bicara", after: ["transcribe"] },
  integrity: { id: "integrity", label: "Pemeriksaan integritas", after: ["transcribe"] },
  review: { id: "review", label: "Menunggu tinjauan dosen", after: ["score", "speech", "integrity"] },
};

const SEQUENCE: (StageId | StageId[])[] = [
  "upload",
  "extract",
  "transcribe",
  ["score", "speech", "integrity"],
  "review",
];

// Simulasi pipeline sampai backend mengirim status nyata (mis. lewat polling atau websocket).
const DONE_AFTER_MS: Partial<Record<StageId, number>> = {
  extract: 2000,
  transcribe: 4500,
  speech: 6200,
  integrity: 7600,
  score: 8800,
};

const STATUS_TEXT: Record<StageStatus, string> = {
  pending: "Menunggu giliran",
  active: "Sedang berjalan",
  done: "Selesai",
  waiting: "Dosen akan meninjau hasil AI sebelum menjadi nilai",
};

function StageIcon({ status }: { status: StageStatus }) {
  // key memicu animasi masuk saat ikon berganti status.
  if (status === "done") return <CircleCheck key="done" aria-hidden className="animate-pop-in size-6 text-success" />;
  if (status === "active") return <LoaderCircle key="active" aria-hidden className="size-6 animate-spin text-info" />;
  if (status === "waiting") return <Clock3 key="waiting" aria-hidden className="animate-pop-in size-6 text-info" />;
  return <Circle key="pending" aria-hidden className="size-6 text-line" />;
}

function StageRow({ stage, status }: { stage: Stage; status: StageStatus }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <StageIcon status={status} />
      <div>
        <p
          className={cn(
            "text-body-lg",
            status === "pending" ? "text-fg-muted" : "font-medium text-fg",
            status === "active" && "animate-pulse-soft",
          )}
        >
          {stage.label}
        </p>
        <p className="text-body-sm text-fg-muted">{STATUS_TEXT[status]}</p>
      </div>
    </li>
  );
}

export function ProcessingChecklist() {
  const [done, setDone] = useState<StageId[]>(["upload"]);

  useEffect(() => {
    const timers = Object.entries(DONE_AFTER_MS).map(([id, ms]) =>
      window.setTimeout(() => setDone((current) => [...current, id as StageId]), ms),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const statusOf = (id: StageId): StageStatus => {
    if (done.includes(id)) return "done";
    if (STAGES[id].after.every((dep) => done.includes(dep))) return id === "review" ? "waiting" : "active";
    return "pending";
  };

  const total = Object.keys(STAGES).length;
  const latest = STAGES[done[done.length - 1]];
  const aiFinished = statusOf("review") === "waiting";

  return (
    <div>
      <p className="text-body-sm font-medium text-fg-muted">
        <span className="font-mono tabular-nums">{done.length}</span> dari{" "}
        <span className="font-mono tabular-nums">{total}</span> tahap selesai
      </p>
      <p aria-live="polite" className="sr-only">
        {aiFinished ? "Penilaian AI selesai. Menunggu tinjauan dosen." : `Selesai: ${latest.label}`}
      </p>

      <ol className="mt-2 divide-y divide-line">
        {SEQUENCE.map((step) =>
          Array.isArray(step) ? (
            <li key={step.join("-")} className="py-3">
              <p className="text-caption text-fg-muted">Tiga pemeriksaan ini berjalan bersamaan</p>
              <ul className="mt-1 border-l-2 border-line pl-4">
                {step.map((id) => (
                  <StageRow key={id} stage={STAGES[id]} status={statusOf(id)} />
                ))}
              </ul>
            </li>
          ) : (
            <StageRow key={step} stage={STAGES[step]} status={statusOf(step)} />
          ),
        )}
      </ol>
    </div>
  );
}
