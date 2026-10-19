"use client";

import { useEffect, useState } from "react";

/** Angka naik dari 0 ke nilai akhir satu kali (600ms). Dengan reduced motion langsung tampil. */
export function CountUp({ value, durationMs = 600 }: { value: number; durationMs?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (reduceMotion) {
        setDisplay(value);
        return;
      }
      start ??= now;
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return (
    <>
      <span aria-hidden>{display}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}
