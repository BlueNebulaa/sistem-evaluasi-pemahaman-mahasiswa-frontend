"use client";

import { useState } from "react";
import { Card } from "./ui";

type ReviewAction = "pass" | "fail" | "save";

const STATUS_MESSAGES: Record<ReviewAction, string> = {
  pass: "Hasil review ditandai lolos.",
  fail: "Hasil review ditandai tidak lolos.",
  save: "Catatan disimpan.",
};

type ReviewerNotesProps = {
  id: string;
  initialNotes: string;
  decision: string;
  notesRequired: boolean;
};

export function ReviewerNotes({ id, initialNotes, decision, notesRequired }: ReviewerNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function submit(action: ReviewAction) {
    if ((notesRequired || action === "save") && notes.trim() === "") {
      setStatus(null);
      setError("Catatan reviewer wajib diisi terlebih dahulu.");
      return;
    }
    setError(null);
    setStatus(STATUS_MESSAGES[action]);
  }

  return (
    <Card className="p-4 sm:p-5">
      <section id={id} className="scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">
            <label htmlFor={`${id}-input`}>Catatan reviewer</label>
          </h2>
          {notesRequired && (
            <p className="text-[11px] text-amber-600">
              Wajib diisi karena keputusan “{decision}”
            </p>
          )}
        </div>

        <textarea
          id={`${id}-input`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          required={notesRequired}
          aria-invalid={error !== null}
          placeholder="Tulis catatan untuk hasil review ini (mis. konfirmasi suara kedua pada Q2)..."
          className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => submit("pass")}
            className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Tandai lolos
          </button>
          <button
            type="button"
            onClick={() => submit("fail")}
            className="rounded-lg bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            Tandai tidak lolos
          </button>
          <button
            type="button"
            onClick={() => submit("save")}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-50"
          >
            Simpan catatan
          </button>
          <p aria-live="polite" className="text-xs">
            {error && <span className="text-red-600">{error}</span>}
            {status && <span className="text-emerald-700">{status}</span>}
          </p>
        </div>
      </section>
    </Card>
  );
}
