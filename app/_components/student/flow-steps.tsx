import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

const STEPS = ["Panduan", "Unggah video", "Penilaian"];

/** Penunjuk langkah alur asesmen: Panduan → Unggah → Penilaian. */
export function FlowSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <nav aria-label={`Langkah ${current + 1} dari ${STEPS.length}`} className="mb-8">
      <ol className="flex items-center gap-2">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li
              key={label}
              aria-current={active ? "step" : undefined}
              className={cn("flex items-center gap-2", i < STEPS.length - 1 && "flex-1")}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full font-mono text-caption",
                  done && "bg-primary text-on-primary",
                  active && "border-2 border-primary text-primary",
                  !done && !active && "border border-line text-fg-muted",
                )}
              >
                {done ? <Check aria-hidden className="size-4" /> : i + 1}
                {done && <span className="sr-only">Selesai: </span>}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-body-sm",
                  active ? "font-semibold text-fg" : "hidden text-fg-muted sm:inline",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span aria-hidden className={cn("h-px flex-1", done ? "bg-primary" : "bg-line")} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
