"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { formatSpokenTime, formatTimestamp } from "@/lib/format";
import type { ReviewQuestion } from "@/lib/normalize-review";
import { usePlayer } from "./player-context";

/** Transkrip per segmen. Segmen yang sedang diputar disorot; klik timestamp = seek video. */
export function TranscriptPanel({ questions, className }: { questions: ReviewQuestion[]; className?: string }) {
  const { currentTime, seek, seekToken } = usePlayer();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeId =
    questions
      .flatMap((q) => q.segments)
      .find((s) => s.startSec !== null && s.endSec !== null && currentTime >= s.startSec && currentTime < s.endSec)
      ?.id ?? null;

  // Setelah dosen melompat ke detik tertentu, segmen terkait digulir ke tengah panel.
  useEffect(() => {
    if (seekToken === 0) return;
    const container = scrollRef.current;
    const active = container?.querySelector<HTMLElement>('[data-active="true"]');
    if (!container || !active) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollTo({
      top: active.offsetTop - container.clientHeight / 2 + active.clientHeight / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [seekToken]);

  return (
    <section
      aria-labelledby="judul-transkrip"
      className={cn("rounded-lg border border-line bg-surface shadow-xs", className)}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 id="judul-transkrip" className="text-body font-semibold text-fg">
          Transkrip
        </h2>
        <span className="text-caption text-fg-muted">Klik waktu untuk memutar dari detik itu</span>
      </div>
      <div ref={scrollRef} className="relative max-h-[22rem] min-h-0 flex-1 overflow-y-auto px-2 pb-2 xl:max-h-none">
        {questions.map((q) => (
          <div key={q.id}>
            <p className="sticky top-0 z-[1] bg-surface px-2 pb-1 pt-3 text-caption font-semibold text-fg-muted">
              Q{q.index}
              {q.title && ` · ${q.title}`}
            </p>
            {q.segments.length === 0 ? (
              <p className="px-2 py-2 text-body-sm text-fg-muted">Transkrip belum tersedia.</p>
            ) : (
              <ol>
                {q.segments.map((s) => {
                  const active = s.id === activeId;
                  return (
                    <li
                      key={s.id}
                      data-active={active}
                      aria-current={active ? "time" : undefined}
                      className="flex gap-3 rounded-md px-2 py-2 transition-colors duration-(--motion-base) ease-standard data-[active=true]:bg-primary-soft"
                    >
                      {s.startSec !== null ? (
                        <button
                          type="button"
                          onClick={() => seek(s.startSec as number)}
                          aria-label={`Putar dari ${formatSpokenTime(s.startSec)}`}
                          className="h-6 shrink-0 rounded-sm font-mono text-body-sm tabular-nums text-primary hover:text-primary-hover hover:underline"
                        >
                          {formatTimestamp(s.startSec)}
                        </button>
                      ) : (
                        <span className="h-6 shrink-0 font-mono text-body-sm text-fg-muted">--:--</span>
                      )}
                      <p className="max-w-[72ch] text-body text-fg">{s.text}</p>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
