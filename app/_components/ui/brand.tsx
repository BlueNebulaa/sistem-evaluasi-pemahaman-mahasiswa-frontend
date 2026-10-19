import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const MAIN_CONTENT_ID = "konten-utama";

export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only rounded-md bg-surface px-4 py-2 text-body-sm font-semibold text-fg shadow-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
    >
      Lewati ke konten
    </a>
  );
}

/** Mark: gelembung bicara dengan tanda centang, untuk "jawaban lisan yang ditinjau". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8 shrink-0", className)}>
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path
        d="M10 10.5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6.5L11 25v-3.5h-1a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="var(--on-primary)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="m12.75 16 2.25 2.25 4.25-4.5"
        fill="none"
        stroke="var(--on-primary)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className, hideWordmark = false }: { className?: string; hideWordmark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!hideWordmark && <span className="text-body-lg font-bold tracking-tight text-fg">Themis</span>}
    </span>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-body-sm font-medium text-fg-muted transition-colors duration-(--motion-fast) ease-standard hover:text-fg"
    >
      <ArrowLeft aria-hidden className="size-4" />
      {children}
    </Link>
  );
}

export function Avatar({ initials, label }: { initials: string; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-caption font-semibold text-primary"
    >
      {initials}
    </span>
  );
}
