"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { THEME_STORAGE_KEY, type ThemeChoice } from "@/lib/theme";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readTheme(): ThemeChoice {
  const theme = document.documentElement.dataset.theme;
  return theme === "light" || theme === "dark" ? theme : "system";
}

function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
  try {
    if (choice === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Penyimpanan diblokir (mis. mode privat): tema tetap berlaku untuk halaman ini.
  }
  listeners.forEach((listener) => listener());
}

const NEXT_THEME: Record<ThemeChoice, ThemeChoice> = { system: "light", light: "dark", dark: "system" };
const THEME_LABEL: Record<ThemeChoice, string> = {
  system: "Ikuti perangkat",
  light: "Terang",
  dark: "Gelap",
};
const THEME_ICON = { system: Monitor, light: Sun, dark: Moon };

export function ThemeToggle({ showLabel = false, className }: { showLabel?: boolean; className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as const);
  const Icon = THEME_ICON[theme];

  return (
    <button
      type="button"
      onClick={() => applyTheme(NEXT_THEME[theme])}
      aria-label={`Tema: ${THEME_LABEL[theme]}. Ganti ke ${THEME_LABEL[NEXT_THEME[theme]].toLowerCase()}`}
      title={`Tema: ${THEME_LABEL[theme]}`}
      className={cn(
        "inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md px-2.5 text-body-sm font-medium text-fg-muted",
        "transition-colors duration-(--motion-fast) ease-standard hover:bg-surface-muted hover:text-fg",
        className,
      )}
    >
      <Icon aria-hidden className="size-5" />
      {showLabel && <span>{THEME_LABEL[theme]}</span>}
    </button>
  );
}
