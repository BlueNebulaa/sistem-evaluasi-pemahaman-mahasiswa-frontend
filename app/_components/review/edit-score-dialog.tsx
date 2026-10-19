"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { ReviewQuestion } from "@/lib/normalize-review";
import { scoreLabel, scoreOptions, type ScoreScale } from "@/lib/score";
import { Button } from "../ui/button";

/** Modal koreksi skor. Dibuka dengan me-mount komponen; Esc atau Batal menutup. */
export function EditScoreDialog({
  questions,
  scale,
  currentScores,
  initialQuestionId,
  onSave,
  onClose,
}: {
  questions: ReviewQuestion[];
  scale: ScoreScale;
  currentScores: Record<number, number>;
  initialQuestionId: number;
  onSave: (questionId: number, score: number, reason: string) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [questionId, setQuestionId] = useState(initialQuestionId);
  const [score, setScore] = useState(currentScores[initialQuestionId]);
  const [reason, setReason] = useState("");
  const titleId = useId();
  const reasonId = useId();

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const unchanged = score === currentScores[questionId];
  const canSave = !unchanged && reason.trim().length > 0;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    onSave(questionId, score, reason.trim());
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-xl border border-line bg-surface p-0 text-fg shadow-lg"
    >
      <form onSubmit={submit}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id={titleId} className="text-h3 text-fg">
            Ubah skor
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="-mr-2 grid size-10 place-items-center rounded-md text-fg-muted hover:bg-surface-muted hover:text-fg"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <label htmlFor="pilih-pertanyaan" className="text-body-sm font-medium text-fg">
              Pertanyaan
            </label>
            <div className="relative mt-1.5">
              <select
                id="pilih-pertanyaan"
                value={questionId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setQuestionId(id);
                  setScore(currentScores[id]);
                }}
                className="h-10 w-full appearance-none rounded-sm border border-line bg-surface pl-3 pr-9 text-body-sm text-fg focus:border-primary"
              >
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    Q{q.index} · {q.title ?? `Pertanyaan ${q.index}`} (skor {currentScores[q.id]})
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
            </div>
          </div>

          <fieldset>
            <legend className="text-body-sm font-medium text-fg">Skor baru</legend>
            <div className="mt-1.5 grid grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] gap-2">
              {scoreOptions(scale).map((value) => (
                <label
                  key={value}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-0.5 rounded-md border border-line px-1 py-2 text-center transition-colors duration-(--motion-fast) ease-standard hover:bg-surface-muted",
                    "has-checked:border-primary has-checked:bg-primary-soft has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary",
                  )}
                >
                  <input
                    type="radio"
                    name="skor"
                    value={value}
                    checked={score === value}
                    onChange={() => setScore(value)}
                    className="sr-only"
                  />
                  <span className="font-mono text-h3 tabular-nums text-fg">{value}</span>
                  <span className="text-caption leading-tight text-fg-muted">{scoreLabel(value, scale)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor={reasonId} className="text-body-sm font-medium text-fg">
              Alasan koreksi
            </label>
            <textarea
              id={reasonId}
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mis. analisis kompleksitas sebenarnya dijelaskan benar di menit 06:10."
              className="mt-1.5 block w-full resize-y rounded-sm border border-line bg-surface px-3 py-2 text-body-sm text-fg placeholder:text-fg-muted focus:border-primary"
            />
            <p className="mt-1.5 text-caption text-fg-muted">
              Alasan dicatat bersama nama Anda dan waktu perubahan. Skor total dihitung ulang oleh sistem.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-6 py-4">
          <Button onClick={onClose}>Batal</Button>
          <Button type="submit" variant="primary" disabled={!canSave}>
            Simpan skor
          </Button>
        </div>
      </form>
    </dialog>
  );
}
