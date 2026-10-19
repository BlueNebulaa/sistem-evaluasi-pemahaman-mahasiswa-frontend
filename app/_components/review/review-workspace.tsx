"use client";

import { CircleCheck, Eye, Info, Keyboard, PencilLine, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import type { Submission } from "@/lib/mock-data";
import type { Review } from "@/lib/normalize-review";
import { AIBadge, StatusBadge } from "../ui/badges";
import { BackLink } from "../ui/brand";
import { Button } from "../ui/button";
import { useToast } from "../ui/toast";
import { Tooltip } from "../ui/tooltip";
import { EditScoreDialog } from "./edit-score-dialog";
import { usePlayer, PlayerProvider } from "./player-context";
import { QuestionItem, type FlagDecision, type ScoreCorrection } from "./question-item";
import { TranscriptPanel } from "./transcript-panel";
import { VideoPlayer } from "./video-player";

const SHORTCUTS = [
  { keys: ["J"], label: "Pertanyaan berikutnya" },
  { keys: ["K"], label: "Pertanyaan sebelumnya" },
  { keys: ["Spasi"], label: "Putar / jeda video" },
  { keys: ["A"], label: "Setujui hasil" },
  { keys: ["←", "→"], label: "Geser 5 detik (saat timeline difokus)" },
];

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-grid h-6 min-w-6 place-items-center rounded-sm border border-line bg-surface-muted px-1.5 font-mono text-caption text-fg">
      {children}
    </kbd>
  );
}

function ShortcutHelp() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="ghost" aria-expanded={open} aria-controls="daftar-pintasan" onClick={() => setOpen((v) => !v)}>
        <Keyboard aria-hidden />
        Pintasan
      </Button>
      {open && (
        <div
          id="daftar-pintasan"
          className="animate-fade-in absolute right-0 top-full z-30 mt-2 w-72 rounded-lg border border-line bg-surface p-4 shadow-md"
        >
          <p className="text-body-sm font-semibold text-fg">Pintasan keyboard</p>
          <ul className="mt-3 space-y-2">
            {SHORTCUTS.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-3 text-body-sm text-fg-muted">
                {s.label}
                <span className="flex gap-1">
                  {s.keys.map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

type Approval = { by: string | null; at: string | null };

function Workspace({
  review,
  submission,
  reviewerName,
}: {
  review: Review;
  submission: Submission;
  reviewerName: string;
}) {
  const toast = useToast();
  const { currentTime, seek, toggle } = usePlayer();
  const { questions, scale } = review;

  const [openId, setOpenId] = useState<number | null>(
    () => (questions.find((q) => q.flagged) ?? questions[0])?.id ?? null,
  );
  const [flagDecisions, setFlagDecisions] = useState<Record<number, FlagDecision>>({});
  const [corrections, setCorrections] = useState<Record<number, ScoreCorrection>>({});
  const [notes, setNotes] = useState(review.notes);
  const [approval, setApproval] = useState<Approval | null>(
    review.status === "approved" ? { by: null, at: review.reviewedAt } : null,
  );
  const [editingId, setEditingId] = useState<number | null>(null);

  const approved = approval !== null;
  const status = approved ? "approved" : review.status;
  const pendingFlags = approved ? [] : questions.filter((q) => q.flagged && !flagDecisions[q.id]);
  const currentScores = Object.fromEntries(questions.map((q) => [q.id, corrections[q.id]?.to ?? q.score]));
  const playingId =
    questions.find((q) => q.startSec !== null && q.endSec !== null && currentTime >= q.startSec && currentTime < q.endSec)
      ?.id ?? null;

  function toggleQuestion(id: number) {
    const opening = openId !== id;
    setOpenId(opening ? id : null);
    const start = questions.find((q) => q.id === id)?.startSec;
    if (opening && start != null) seek(start);
  }

  function goToQuestion(delta: 1 | -1) {
    const index = questions.findIndex((q) => q.id === (openId ?? playingId));
    const next = questions[Math.min(questions.length - 1, Math.max(0, index + delta))];
    if (!next) return;
    setOpenId(next.id);
    if (next.startSec !== null) seek(next.startSec);
    document.getElementById(`pertanyaan-${next.id}`)?.scrollIntoView({ block: "nearest" });
  }

  function decideFlags(ids: number[], decision: FlagDecision) {
    setFlagDecisions((current) => ({ ...current, ...Object.fromEntries(ids.map((id) => [id, decision])) }));
  }

  function approve() {
    if (approved) return;
    if (pendingFlags.length > 0) {
      toast({
        tone: "warning",
        title: "Putuskan sinyal integritas dulu",
        description: `${pendingFlags.length} pertanyaan masih perlu ditandai aman atau ditindaklanjuti.`,
      });
      return;
    }
    setApproval({ by: reviewerName, at: new Date().toISOString() });
    toast({
      title: "Hasil disetujui",
      description: "Mahasiswa akan menerima notifikasi hasilnya.",
      action: { label: "Batalkan", onClick: () => setApproval(null) },
    });
  }

  const onShortcut = useEffectEvent((e: KeyboardEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || editingId !== null) return;
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea, select, [contenteditable='true'], dialog")) return;
    const key = e.key.toLowerCase();
    if (key === "j" || key === "k") {
      e.preventDefault();
      goToQuestion(key === "j" ? 1 : -1);
    } else if (key === " ") {
      // Spasi pada tombol/tautan tetap menjalankan tombol itu.
      if (target.closest("button, a, [role='slider']")) return;
      e.preventDefault();
      toggle();
    } else if (key === "a") {
      e.preventDefault();
      approve();
    }
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => onShortcut(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto max-w-360 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <BackLink href="/dosen/antrian">Antrian</BackLink>
            <ShortcutHelp />
          </div>
          <h1 className="mt-1 text-h2 text-fg">
            {submission.studentName}
            <span className="font-normal text-fg-muted">
              {" "}
              · {submission.course} · Percobaan {submission.attempt}
            </span>
          </h1>
          <p className="mt-0.5 text-body-sm text-fg-muted">
            <span className="font-mono">NIM {submission.nim}</span> · {submission.topic}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            <StatusBadge status={status} />
            <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-body-sm">
              <div className="flex items-baseline gap-1.5">
                <dt className="text-fg-muted">Total</dt>
                <dd className="font-mono text-h3 tabular-nums text-fg">{review.scores.total}</dd>
                <Tooltip content="Rumus bobot project dan interview belum dikirim backend.">
                  <button type="button" aria-label="Tentang skor total" className="self-center rounded-sm text-fg-muted hover:text-fg">
                    <Info aria-hidden className="size-4" />
                  </button>
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="text-fg-muted">Project</dt>
                <dd className="font-mono font-semibold tabular-nums text-fg">{review.scores.project}</dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="text-fg-muted">Interview</dt>
                <dd className="font-mono font-semibold tabular-nums text-fg">{review.scores.interview}</dd>
              </div>
            </dl>
            <Tooltip content={`Asesor: ${review.assessorName}`}>
              <span tabIndex={0} className="rounded-full">
                <AIBadge reviewed={approved} />
              </span>
            </Tooltip>
            {review.reviewedAt && (
              <span className="text-body-sm text-fg-muted">Dinilai {formatDateTime(review.reviewedAt)}</span>
            )}
          </div>

          {!approved && review.decisionReasons.length > 0 && (
            <p className="mt-3 flex items-start gap-2 rounded-md bg-warning-soft px-3 py-2 text-body-sm text-fg">
              <Eye aria-hidden className="mt-0.5 size-4 text-warning" />
              <span>
                <span className="font-semibold">Alasan perlu ditinjau:</span> {review.decisionReasons.join("; ")}
              </span>
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-360 flex-1 gap-4 px-4 py-4 sm:px-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* Di ≥1280px kolom kiri menempel dan setinggi layar; transkrip mengisi sisa ruang. */}
        <div className="min-w-0 space-y-4 xl:sticky xl:top-4 xl:flex xl:max-h-[calc(100dvh-8.5rem)] xl:flex-col xl:gap-4 xl:space-y-0 xl:self-start">
          <VideoPlayer videoUrl={review.videoUrl} questions={questions} markers={review.markers} />
          <TranscriptPanel questions={questions} className="xl:flex xl:min-h-48 xl:flex-1 xl:flex-col" />
        </div>

        <section aria-labelledby="judul-pertanyaan" className="min-w-0 self-start rounded-lg border border-line bg-surface shadow-xs">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <h2 id="judul-pertanyaan" className="text-body font-semibold text-fg">
              Pertanyaan <span className="font-mono font-normal text-fg-muted">({questions.length})</span>
            </h2>
            {pendingFlags.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-caption text-warning">
                <Eye aria-hidden className="size-4" />
                {pendingFlags.length} sinyal perlu keputusan
              </span>
            )}
          </div>
          <ul className="divide-y divide-line">
            {questions.map((q) => (
              <QuestionItem
                key={q.id}
                question={q}
                scale={scale}
                open={openId === q.id}
                playing={playingId === q.id}
                reviewed={approved}
                correction={corrections[q.id]}
                flagDecision={flagDecisions[q.id]}
                onToggle={() => toggleQuestion(q.id)}
                onSeek={seek}
                onFlagDecision={(decision) => decideFlags([q.id], decision)}
              />
            ))}
          </ul>
        </section>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-line bg-surface">
        <div className="mx-auto flex max-w-360 flex-col gap-3 px-4 py-3 sm:px-6 xl:flex-row xl:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="catatan-dosen" className="text-caption text-fg-muted">
              Catatan dosen
            </label>
            <textarea
              id="catatan-dosen"
              rows={1}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tulis alasan keputusan atau masukan tambahan untuk mahasiswa"
              className="mt-1 block min-h-10 w-full resize-y rounded-sm border border-line bg-surface px-3 py-2 text-body-sm text-fg placeholder:text-fg-muted focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5 xl:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <Button disabled={approved} onClick={() => setEditingId(openId ?? questions[0]?.id ?? null)}>
                <PencilLine aria-hidden />
                Ubah skor
              </Button>
              {pendingFlags.length > 0 && (
                <>
                  <Button onClick={() => decideFlags(pendingFlags.map((q) => q.id), "safe")}>
                    <ShieldCheck aria-hidden />
                    Tandai aman
                  </Button>
                  <Button variant="ghost" onClick={() => decideFlags(pendingFlags.map((q) => q.id), "follow-up")}>
                    <ShieldAlert aria-hidden />
                    Tindak lanjuti
                  </Button>
                </>
              )}
              <Button
                variant="primary"
                aria-keyshortcuts="A"
                disabled={approved || pendingFlags.length > 0}
                aria-describedby={pendingFlags.length > 0 ? "alasan-setujui" : undefined}
                onClick={approve}
              >
                <CircleCheck aria-hidden />
                {approved ? "Sudah disetujui" : "Setujui hasil"}
              </Button>
            </div>
            <p id="alasan-setujui" className={cn("text-caption text-fg-muted", !approved && pendingFlags.length === 0 && "sr-only")}>
              {approved
                ? approval.by
                  ? `Disetujui oleh ${approval.by}${approval.at ? ` · ${formatDateTime(approval.at)}` : ""}`
                  : "Hasil ini sudah disetujui sebelumnya."
                : pendingFlags.length > 0
                  ? "Putuskan sinyal integritas dulu: tandai aman atau tindak lanjuti."
                  : "Tekan A untuk menyetujui."}
            </p>
          </div>
        </div>
      </div>

      {editingId !== null && (
        <EditScoreDialog
          questions={questions}
          scale={scale}
          currentScores={currentScores}
          initialQuestionId={editingId}
          onClose={() => setEditingId(null)}
          onSave={(questionId, score, reason) => {
            const original = questions.find((q) => q.id === questionId)?.score ?? score;
            setCorrections((current) => {
              const next = { ...current };
              if (score === original) delete next[questionId];
              else next[questionId] = { from: original, to: score, reason };
              return next;
            });
            setOpenId(questionId);
            toast({ title: "Skor diperbarui", description: `Q${questions.find((q) => q.id === questionId)?.index} sekarang ${score}.` });
          }}
        />
      )}
    </div>
  );
}

export function ReviewWorkspace(props: { review: Review; submission: Submission; reviewerName: string }) {
  return (
    <PlayerProvider videoUrl={props.review.videoUrl} durationSec={props.review.durationSec}>
      <Workspace {...props} />
    </PlayerProvider>
  );
}
