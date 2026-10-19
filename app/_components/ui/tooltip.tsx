"use client";

import { cloneElement, useId, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Tooltip ringan untuk hover dan fokus keyboard. Anak harus elemen yang bisa difokus;
 * isi tooltip ditautkan lewat aria-describedby.
 */
export function Tooltip({
  content,
  children,
  align = "center",
}: {
  content: ReactNode;
  children: ReactElement<{ "aria-describedby"?: string }>;
  align?: "center" | "start" | "end";
}) {
  const id = useId();
  return (
    <span className="group/tip relative inline-flex">
      {cloneElement(children, { "aria-describedby": id })}
      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute bottom-full z-40 mb-2 w-max max-w-64 rounded-md bg-fg px-2.5 py-1.5 text-caption text-canvas opacity-0 shadow-md",
          "transition-opacity duration-(--motion-fast) ease-standard group-hover/tip:opacity-100 group-focus-within/tip:opacity-100",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "start" && "left-0",
          align === "end" && "right-0",
        )}
      >
        {content}
      </span>
    </span>
  );
}
