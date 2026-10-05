import { Fragment } from "react";
import { ArrowRightIcon } from "./icons";
import { Card, StepChip } from "./ui";

const PIPELINES = [
  {
    title: "Pemahaman materi",
    input: "Audio",
    steps: ["Audio Extraction", "Transcription", "LLM", "Scoring"],
  },
  {
    title: "Non-verbal",
    input: "Audio + Video",
    steps: ["Audio Extraction", "Non Verbal Analysis"],
  },
  {
    title: "Deteksi kecurangan",
    input: "Video",
    steps: ["Frame Extraction", "Object Detection", "Eye Movement Analysis"],
  },
];

export function AnalysisPipeline() {
  const totalSteps = PIPELINES.reduce((sum, pipeline) => sum + pipeline.steps.length, 0);

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">Pipeline analisis</h2>
        <p className="text-[11px] text-slate-500">
          Input Video → {PIPELINES.length} jalur paralel → JSON · {totalSteps}/{totalSteps} tahap
          selesai
        </p>
      </div>

      <ol className="mt-3 space-y-2">
        {PIPELINES.map((pipeline) => (
          <li
            key={pipeline.title}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-slate-50 px-3 py-2.5"
          >
            <div className="w-32 shrink-0">
              <p className="text-xs font-semibold text-slate-900">{pipeline.title}</p>
              <p className="text-[11px] text-slate-500">{pipeline.input}</p>
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {pipeline.steps.map((step, index) => (
                <Fragment key={step}>
                  {index > 0 && <ArrowRightIcon className="size-4 text-slate-700" />}
                  <StepChip label={step} />
                </Fragment>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <ArrowRightIcon className="size-4 text-slate-700" />
              <span className="rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
                JSON
              </span>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
