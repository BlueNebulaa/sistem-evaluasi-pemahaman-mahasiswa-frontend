"use client";

import { ChevronDown, CircleCheck, Eye, Flag, PencilLine, Play, ShieldAlert, ShieldCheck } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatNumber, formatSpokenTime, formatTimestamp } from "@/lib/format";
import type { ReviewQuestion } from "@/lib/normalize-review";
import type { ScoreScale } from "@/lib/score";
import { AIBadge, Badge } from "../ui/badges";
import { Button } from "../ui/button";
import { ScoreChip } from "../ui/score-chip";
import { Tooltip } from "../ui/tooltip";
import { AssessmentFeedback } from "./assessment-feedback";
import { ObjectFlagList, SignalMeter, SpeechStats } from "./signals";

export type FlagDecision = "safe" | "follow-up";
export type ScoreCorrection = { from: number; to: number; reason: string };

function SectionTitle({ children }: { children: ReactNode }) {
  return <h4 className="text-caption font-semibold uppercase tracking-wide text-fg-muted">{children}</h4>;
}

/** QuestionCard sisi dosen: accordion berisi penilaian AI, sinyal integritas, dan cara bicara. */
export function QuestionItem({
  question,
  scale,
  open,
  playing,
  reviewed,
  correction,
  flagDecision,
  onToggle,
  onSeek,
  onFlagDecision,
}: {
  question: ReviewQuestion;
  scale: ScoreScale;
  open: boolean;
  playing: boolean;
  reviewed: boolean;
  correction: ScoreCorrection | undefined;
  flagDecision: FlagDecision | undefined;
  onToggle: () => void;
  onSeek: (sec: number) => void;
  onFlagDecision: (decision: FlagDecision) => void;
}) {
  const panelId = useId();
  const score = correction?.to ?? question.score;
  const { eye } = question;

  return (
    <li
      id={`pertanyaan-${question.id}`}
      className={cn("relative scroll-mt-4", playing && "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary")}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-(--motion-fast) ease-standard hover:bg-surface-muted"
        >
          <span className="mt-0.5 w-7 shrink-0 font-mono text-body-sm font-semibold text-fg-muted">Q{question.index}</span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-body font-semibold text-fg">{question.title ?? `Pertanyaan ${question.index}`}</span>
              {question.flagged && (
                <span className="inline-flex shrink-0 items-center text-warning">
                  <Flag aria-hidden className="size-4" />
                  <span className="sr-only">Ada sinyal integritas</span>
                </span>
              )}
              {playing && <span className="sr-only">(sedang diputar)</span>}
            </span>
            <span className="mt-0.5 line-clamp-2 text-body-sm text-fg-muted">{question.transcript}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            {correction && (
              <span className="text-fg-muted">
                <PencilLine aria-hidden className="size-4" />
                <span className="sr-only">Skor dikoreksi dosen</span>
              </span>
            )}
            <ScoreChip score={score} scale={scale} />
          </span>
          <ChevronDown
            aria-hidden
            className={cn("mt-1 size-5 shrink-0 text-fg-muted transition-transform duration-(--motion-base) ease-standard", open && "rotate-180")}
          />
        </button>
      </h3>

      <div id={panelId} className="accordion-panel" data-open={open} inert={!open}>
        <div>
          <div className="space-y-5 px-4 pb-4 pl-14">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="max-w-[72ch] text-body-sm text-fg-muted">
                {question.prompt ? (
                  <>
                    <span className="font-semibold text-fg">Pertanyaan: </span>
                    {question.prompt}
                  </>
                ) : (
                  "Teks pertanyaan belum dikirim backend."
                )}
              </p>
              {question.startSec !== null && (
                <Button variant="ghost" onClick={() => onSeek(question.startSec as number)} className="-mr-2">
                  <Play aria-hidden />
                  Putar jawaban
                  <span className="font-mono text-caption font-normal tabular-nums text-fg-muted">
                    {formatTimestamp(question.startSec)}
                    {question.endSec !== null && `–${formatTimestamp(question.endSec)}`}
                  </span>
                </Button>
              )}
            </div>

            <section className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <SectionTitle>Penilaian AI</SectionTitle>
                <AIBadge reviewed={reviewed} />
                {question.assessment.rawScore !== null && (
                  <Tooltip content="Skor mentah dari model sebelum pembulatan ke skala rubrik.">
                    <span tabIndex={0} className="rounded-sm font-mono text-caption text-fg-muted underline decoration-dotted underline-offset-2">
                      Skor mentah AI: {formatNumber(question.assessment.rawScore, 2)}
                    </span>
                  </Tooltip>
                )}
              </div>
              {correction && (
                <p className="flex items-start gap-2 rounded-md bg-surface-muted px-3 py-2 text-body-sm text-fg">
                  <PencilLine aria-hidden className="mt-0.5 size-4 text-fg-muted" />
                  <span>
                    Skor dikoreksi dari <span className="font-mono font-semibold">{correction.from}</span> ke{" "}
                    <span className="font-mono font-semibold">{correction.to}</span>. Alasan: {correction.reason}
                  </span>
                </p>
              )}
              <AssessmentFeedback assessment={question.assessment} audience="lecturer" />
            </section>

            <section className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <SectionTitle>Sinyal integritas</SectionTitle>
                {flagDecision === "safe" ? (
                  <Badge tone="success" icon={ShieldCheck}>Ditandai aman</Badge>
                ) : flagDecision === "follow-up" ? (
                  <Badge tone="warning" icon={ShieldAlert}>Ditindaklanjuti</Badge>
                ) : question.flagged ? (
                  <Badge tone="warning" icon={Eye}>Perlu ditinjau</Badge>
                ) : (
                  <Badge tone="success" icon={CircleCheck}>Normal</Badge>
                )}
              </div>

              <div>
                <p className="mb-2 text-body-sm font-medium text-fg">Objek di sekitar</p>
                <ObjectFlagList objects={question.objects} onSeek={onSeek} />
              </div>

              {eye ? (
                <div>
                  <p className="mb-2 text-body-sm font-medium text-fg">Gerak mata</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <SignalMeter label="EFS" value={eye.efsPercent} threshold={eye.thresholds.efsPercent} needsReview={eye.needsReview} />
                    <SignalMeter label="EDP" value={eye.edpPercent} threshold={eye.thresholds.edpPercent} needsReview={eye.needsReview} />
                  </div>
                  <p className="mt-2 text-caption text-fg-muted">
                    Keyakinan model <span className="font-mono tabular-nums">{formatNumber(eye.confidence, 2)}</span>
                  </p>
                  {eye.momentsSec.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-body-sm">
                      <span className="text-fg-muted">Momen janggal:</span>
                      {eye.momentsSec.map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => onSeek(sec)}
                          aria-label={`Lompat ke ${formatSpokenTime(sec)}`}
                          className="rounded-sm px-1 font-mono tabular-nums text-primary hover:text-primary-hover hover:underline"
                        >
                          {formatTimestamp(sec)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-body-sm text-fg-muted">Data gerak mata belum tersedia.</p>
              )}

              {question.flagged && (
                <div className="flex flex-wrap items-center gap-2 rounded-md bg-surface-muted p-3">
                  <p className="mr-auto text-body-sm text-fg">Sinyal ini bukan vonis. Apa keputusan Anda?</p>
                  <Button
                    aria-pressed={flagDecision === "safe"}
                    onClick={() => onFlagDecision("safe")}
                    className={cn(flagDecision === "safe" && "border-primary bg-primary-soft text-primary hover:bg-primary-soft")}
                  >
                    <ShieldCheck aria-hidden />
                    Tandai aman
                  </Button>
                  <Button
                    aria-pressed={flagDecision === "follow-up"}
                    onClick={() => onFlagDecision("follow-up")}
                    className={cn(flagDecision === "follow-up" && "border-primary bg-primary-soft text-primary hover:bg-primary-soft")}
                  >
                    <ShieldAlert aria-hidden />
                    Tindak lanjuti
                  </Button>
                </div>
              )}
            </section>

            <section className="space-y-3">
              <SectionTitle>Cara bicara</SectionTitle>
              {question.speech ? (
                <SpeechStats speech={question.speech} />
              ) : (
                <p className="text-body-sm text-fg-muted">Data cara bicara belum tersedia.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </li>
  );
}
