"use client";

import { useCallback, useSyncExternalStore } from "react";

// Preferensi kecil per pengunjung (mis. sidebar diciutkan). Jika localStorage diblokir,
// nilai tetap tersimpan di memori selama halaman terbuka.
const memory = new Map<string, boolean>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function read(key: string) {
  if (memory.has(key)) return memory.get(key) as boolean;
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function useStoredFlag(key: string): [boolean, (value: boolean) => void] {
  const value = useSyncExternalStore(subscribe, () => read(key), () => false);
  const setValue = useCallback(
    (next: boolean) => {
      memory.set(key, next);
      try {
        localStorage.setItem(key, next ? "1" : "0");
      } catch {
        // Diabaikan: nilai di memori sudah cukup untuk sesi ini.
      }
      listeners.forEach((listener) => listener());
    },
    [key],
  );
  return [value, setValue];
}
