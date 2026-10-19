"use client";

import { CircleCheck, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ToastTone = "success" | "info" | "warning";

type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  action?: { label: string; onClick: () => void };
};

type ToastItem = ToastInput & { id: number };

const TOAST_DURATION_MS = 4000;

const TONE_ICON: Record<ToastTone, { icon: LucideIcon; className: string }> = {
  success: { icon: CircleCheck, className: "text-success" },
  info: { icon: Info, className: "text-info" },
  warning: { icon: TriangleAlert, className: "text-warning" },
};

const ToastContext = createContext<(toast: ToastInput) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

/** Toast di kanan bawah, hilang sendiri setelah 4 detik. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (toast: ToastInput) => {
      nextId.current += 1;
      const id = nextId.current;
      setToasts((current) => [...current.slice(-2), { ...toast, id }]);
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto"
      >
        {toasts.map((toast) => {
          const { icon: Icon, className } = TONE_ICON[toast.tone ?? "success"];
          return (
            <div
              key={toast.id}
              className="animate-rise-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-line bg-surface p-4 shadow-md"
            >
              <Icon aria-hidden className={cn("mt-0.5 size-5", className)} />
              <div className="min-w-0 flex-1">
                <p className="text-body-sm font-semibold text-fg">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-body-sm text-fg-muted">{toast.description}</p>
                )}
                {toast.action && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.action?.onClick();
                      dismiss(toast.id);
                    }}
                    className="mt-2 text-body-sm font-semibold text-primary hover:text-primary-hover"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Tutup notifikasi"
                className="-m-1 grid size-8 place-items-center rounded-sm text-fg-muted hover:bg-surface-muted hover:text-fg"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext>
  );
}
