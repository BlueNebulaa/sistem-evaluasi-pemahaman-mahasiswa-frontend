"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import type { ReviewQuestion } from "@/lib/normalize-review";
import type { ScoreScale } from "@/lib/score";
import { AssessmentFeedback } from "../review/assessment-feedback";
import { AIBadge } from "../ui/badges";
import { ScoreChip } from "../ui/score-chip";

/** QuestionCard versi mahasiswa: skor, kekuatan, yang bisa ditingkatkan, dan saran. Tanpa sinyal integritas. */
export function ResultQuestionCard({
  question,
  scale,
  defaultOpen = false,
}: {
  question: ReviewQuestion;
  scale: ScoreScale;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-surface shadow-xs">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-4 p-6 text-left transition-colors duration-(--motion-fast) ease-standard hover:bg-surface-muted"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-caption text-fg-muted">Pertanyaan {question.index}</span>
            <span className="mt-0.5 block text-h3 text-fg">{question.title ?? `Pertanyaan ${question.index}`}</span>
          </span>
          <ScoreChip score={question.score} scale={scale} size="lg" />
          <ChevronDown
            aria-hidden
            className={cn(
              "size-5 text-fg-muted transition-transform duration-(--motion-base) ease-standard",
              open && "rotate-180",
            )}
          />
        </button>
      </h3>
      <div id={panelId} className="accordion-panel" data-open={open} inert={!open}>
        <div>
          <div className="space-y-6 border-t border-line p-6">
            {question.prompt && (
              <p className="max-w-[72ch] text-body-lg text-fg-muted">
                <span className="sr-only">Pertanyaan: </span>“{question.prompt}”
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-body-lg font-semibold text-fg">Masukan untukmu</h4>
              <AIBadge reviewed />
            </div>
            <AssessmentFeedback assessment={question.assessment} audience="student" />
          </div>
        </div>
      </div>
    </article>
  );
}
