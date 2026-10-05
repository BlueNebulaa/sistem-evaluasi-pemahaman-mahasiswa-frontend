import { useId, useState } from "react";
import { isEyeTrackingNormal, type InterviewScore } from "@/lib/review";
import { ChevronDownIcon } from "./icons";
import { MetricTile, Pill, ScoreMeter } from "./ui";

type QuestionCardProps = {
  item: InterviewScore;
  number: number;
  flagged: boolean;
  minScore: number;
  maxScore: number;
};

export function QuestionCard({ item, number, flagged, minScore, maxScore }: QuestionCardProps) {
  // Jawaban sempurna tanpa indikasi kecurangan dilipat secara default.
  const [open, setOpen] = useState(flagged || item.score < maxScore);
  const detailsId = useId();

  const { justification, cheatingSignals, speechBehavior } = item.aiAssessment;
  const { objectDetection, eyeTracking } = cheatingSignals;
  const eyeNormal = isEyeTrackingNormal(eyeTracking);
  const scoreRatio = (item.score - minScore) / Math.max(maxScore - minScore, 1);
  const meterTone = flagged ? "warning" : scoreRatio >= 0.5 ? "success" : "danger";

  const summary = [
    `id: ${item.id}`,
    objectDetection.hasSuspiciousObject
      ? `objek: ${objectDetection.suspiciousObject.join(", ")}`
      : "tanpa objek mencurigakan",
    `eye tracking ${eyeTracking.status}`,
    `${speechBehavior.wordsPerMinute} kata/menit`,
  ].join(" · ");

  return (
    <article
      className={`rounded-2xl border bg-white ${
        flagged ? "border-amber-400 ring-1 ring-amber-400/50" : "border-slate-200"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left sm:px-5"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-indigo-50 text-[11px] font-semibold text-indigo-600">
          Q{number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-slate-900">Pertanyaan {number}</span>
          {open ? (
            <span className="block font-mono text-[11px] text-slate-500">id: {item.id}</span>
          ) : (
            <span className="block truncate text-[11px] text-slate-500">{summary}</span>
          )}
        </span>

        {flagged && <Pill tone="warning">Indikasi kecurangan</Pill>}

        {open ? (
          <span className="flex flex-col items-end gap-1.5">
            <span className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-slate-900">{item.score}</span>
              <span className="text-xs text-slate-500">/{maxScore}</span>
            </span>
            <ScoreMeter score={item.score} minScore={minScore} maxScore={maxScore} tone={meterTone} />
          </span>
        ) : (
          <span className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-900">
              {item.score}/{maxScore}
            </span>
            <ScoreMeter score={item.score} minScore={minScore} maxScore={maxScore} tone={meterTone} />
            <ChevronDownIcon className="size-4 text-slate-500" />
          </span>
        )}
      </button>

      {open && (
        <div
          id={detailsId}
          className="grid gap-5 px-4 pb-5 sm:px-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
        >
          <div className="space-y-3">
            <section className="rounded-xl bg-slate-50 p-3.5">
              <h3 className="text-[11px] font-semibold text-slate-700">Transkrip</h3>
              <blockquote className="mt-1.5 text-[13px] italic leading-relaxed text-slate-700">
                “{item.transcript}”
              </blockquote>
            </section>
            <section className="rounded-xl bg-indigo-50 p-3.5">
              <h3 className="text-[11px] font-semibold text-indigo-600">Justifikasi AI</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700">{justification}</p>
            </section>
          </div>

          <div className="space-y-4">
            <section>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-slate-900">Sinyal kecurangan</h3>
                <Pill tone={eyeNormal ? "success" : "warning"}>Eye tracking: {eyeTracking.status}</Pill>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <MetricTile
                  label="Objek mencurigakan"
                  field="hasSuspiciousObject"
                  tone={objectDetection.hasSuspiciousObject ? "warning" : "success"}
                  value={objectDetection.hasSuspiciousObject ? "Terdeteksi" : "Tidak ada"}
                />
                <MetricTile
                  className="col-span-2"
                  label="Daftar objek"
                  field="suspiciousObject"
                  tone={objectDetection.hasSuspiciousObject ? "warning" : "neutral"}
                  value={<ObjectList objects={objectDetection.suspiciousObject} />}
                />
                <MetricTile
                  label="EFS"
                  field="efsPercent"
                  tone={eyeNormal ? "neutral" : "warning"}
                  value={`${eyeTracking.efsPercent.toFixed(1)}%`}
                />
                <MetricTile
                  label="EDP"
                  field="edpPercent"
                  tone={eyeNormal ? "neutral" : "warning"}
                  value={`${eyeTracking.edpPercent.toFixed(1)}%`}
                />
                <MetricTile
                  label="Keyakinan"
                  field="confidence"
                  value={eyeTracking.confidence.toFixed(2)}
                />
              </div>
            </section>

            <SpeechBehaviorSection speech={speechBehavior} />
          </div>
        </div>
      )}
    </article>
  );
}

function ObjectList({ objects }: { objects: string[] }) {
  if (objects.length === 0) {
    return <span className="text-sm font-normal text-slate-700">— (list kosong)</span>;
  }
  return (
    <span className="flex flex-wrap gap-1.5">
      {objects.map((object) => (
        <span
          key={object}
          className="rounded-full border border-amber-400 bg-white/60 px-2.5 py-0.5 text-xs font-medium text-amber-700"
        >
          {object}
        </span>
      ))}
    </span>
  );
}

function SpeechBehaviorSection({ speech }: { speech: InterviewScore["aiAssessment"]["speechBehavior"] }) {
  const tone = speech.tempo === "Normal" ? "neutral" : "warning";
  return (
    <section>
      <h3 className="text-xs font-semibold text-slate-900">Perilaku bicara</h3>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetricTile label="Kata/menit" field="wordsPerMinute" tone={tone} value={speech.wordsPerMinute} />
        <MetricTile label="Tempo" field="tempo" tone={tone} value={speech.tempo} />
        <MetricTile
          label="Total jeda"
          field="totalSilenceSec"
          tone={tone}
          value={`${speech.totalSilenceSec.toFixed(1)} dtk`}
        />
        <MetricTile label="Kata pengisi" field="fillerWordCount" tone={tone} value={speech.fillerWordCount} />
      </div>
    </section>
  );
}
