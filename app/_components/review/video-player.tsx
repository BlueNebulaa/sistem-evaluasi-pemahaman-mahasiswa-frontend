"use client";

import { Pause, Play, RotateCcw, RotateCw, Triangle, VideoOff } from "lucide-react";
import type { KeyboardEvent, PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { formatSpokenTime, formatTimestamp } from "@/lib/format";
import type { IntegrityMarker, ReviewQuestion } from "@/lib/normalize-review";
import { Tooltip } from "../ui/tooltip";
import { usePlayer } from "./player-context";

const OVERLAY_BUTTON =
  "grid size-10 place-items-center rounded-sm text-on-overlay transition-colors duration-(--motion-fast) ease-standard hover:bg-on-overlay/15";

function Timeline({ questions, markers }: { questions: ReviewQuestion[]; markers: IntegrityMarker[] }) {
  const { currentTime, duration, seek } = usePlayer();

  if (!duration) {
    return (
      <p className="px-4 py-3 text-caption text-fg-muted">
        Durasi video belum tersedia, jadi timeline belum bisa ditampilkan.
      </p>
    );
  }

  const pct = (sec: number) => `${(sec / duration) * 100}%`;
  const timed = questions.filter((q) => q.startSec !== null && q.endSec !== null);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * duration);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const jumps: Record<string, number> = {
      ArrowRight: currentTime + 5,
      ArrowUp: currentTime + 5,
      ArrowLeft: currentTime - 5,
      ArrowDown: currentTime - 5,
      PageUp: currentTime + 30,
      PageDown: currentTime - 30,
      Home: 0,
      End: duration,
    };
    if (e.key in jumps) {
      e.preventDefault();
      seek(jumps[e.key]);
    }
  }

  return (
    <div className="px-4 pb-3 pt-4">
      <div className="relative h-14">
        <div
          role="slider"
          tabIndex={0}
          aria-label="Posisi video"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          aria-valuetext={`${formatSpokenTime(currentTime)} dari ${formatSpokenTime(duration)}`}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
          className="absolute inset-x-0 top-0 h-7 cursor-pointer overflow-hidden rounded-sm bg-surface-muted"
        >
          {timed.map((q, i) => (
            <div
              key={q.id}
              className={cn(
                "absolute inset-y-0 flex items-center border-r-2 border-surface px-2 font-mono text-caption text-fg",
                i % 2 === 0 ? "bg-fg-muted/25" : "bg-fg-muted/15",
              )}
              style={{ left: pct(q.startSec as number), width: pct((q.endSec as number) - (q.startSec as number)) }}
            >
              Q{q.index}
            </div>
          ))}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-full origin-left bg-primary/20"
            style={{ transform: `scaleX(${currentTime / duration})` }}
          />
          <div
            aria-hidden
            className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-primary"
            style={{ left: pct(currentTime) }}
          />
        </div>

        {markers.map((m) => (
          <div key={m.id} className="absolute top-7 -translate-x-1/2" style={{ left: pct(m.timestampSec) }}>
            <Tooltip content={`${m.label} · ${formatTimestamp(m.timestampSec)}`}>
              <button
                type="button"
                onClick={() => seek(m.timestampSec)}
                aria-label={`${m.label} pada ${formatSpokenTime(m.timestampSec)}. Lompat ke detik ini`}
                className="grid size-7 place-items-center rounded-sm text-warning transition-transform duration-(--motion-fast) ease-standard hover:scale-110"
              >
                <Triangle aria-hidden className="size-3.5 fill-current" />
              </button>
            </Tooltip>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-fg-muted">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-2.5 w-4 rounded-sm bg-fg-muted/25" />
          Segmen pertanyaan
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Triangle aria-hidden className="size-3 fill-current text-warning" />
          Sinyal integritas ({markers.length})
        </span>
        {timed.length === 0 && <span>Waktu jawaban per pertanyaan belum tersedia.</span>}
        <span className="ml-auto hidden xl:inline">Fokus timeline, lalu ← → untuk geser 5 detik</span>
      </div>
    </div>
  );
}

/** Video + timeline bermarker. Klik segmen, marker ▲, atau timestamp mana pun = lompat ke detik itu. */
export function VideoPlayer({
  videoUrl,
  questions,
  markers,
}: {
  videoUrl: string | null;
  questions: ReviewQuestion[];
  markers: IntegrityMarker[];
}) {
  const { currentTime, duration, playing, hasVideo, seek, toggle, bindings } = usePlayer();
  const activeQuestion = questions.find(
    (q) => q.startSec !== null && q.endSec !== null && currentTime >= q.startSec && currentTime < q.endSec,
  );

  return (
    <section aria-label="Video jawaban" className="shrink-0 overflow-hidden rounded-lg border border-line bg-surface shadow-xs">
      <div className="relative aspect-video bg-video xl:max-h-[42dvh] xl:w-full">
        {hasVideo && videoUrl ? (
          <video {...bindings} src={videoUrl} playsInline preload="metadata" className="size-full" />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-6 pb-20 text-center text-on-overlay">
            <div>
              <VideoOff aria-hidden className="mx-auto size-8" />
              <p className="mt-3 text-body font-medium">Video belum tersedia</p>
              <p className="mx-auto mt-1 max-w-[44ch] text-body-sm">
                Backend belum mengirim URL video. Timeline dan transkrip tetap bisa dipakai dalam mode
                simulasi.
              </p>
            </div>
          </div>
        )}

        {activeQuestion && (
          <p className="video-glass absolute left-3 top-3 rounded-sm px-2.5 py-1 text-caption text-on-overlay">
            Q{activeQuestion.index}
            {activeQuestion.title && ` · ${activeQuestion.title}`}
          </p>
        )}

        <div className="video-glass absolute inset-x-3 bottom-3 flex items-center gap-1 rounded-md p-1">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Jeda video" : "Putar video"}
            aria-keyshortcuts="Space"
            className={OVERLAY_BUTTON}
          >
            {playing ? <Pause aria-hidden className="size-5" /> : <Play aria-hidden className="size-5" />}
          </button>
          <button type="button" onClick={() => seek(currentTime - 5)} aria-label="Mundur 5 detik" className={OVERLAY_BUTTON}>
            <RotateCcw aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={() => seek(currentTime + 5)} aria-label="Maju 5 detik" className={OVERLAY_BUTTON}>
            <RotateCw aria-hidden className="size-5" />
          </button>
          <span className="ml-2 font-mono text-body-sm tabular-nums text-on-overlay">
            {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
          </span>
        </div>
      </div>
      <Timeline questions={questions} markers={markers} />
    </section>
  );
}
