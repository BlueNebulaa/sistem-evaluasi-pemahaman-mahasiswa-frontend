import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "../ui/card";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "neutral" | "warning";
}) {
  return (
    <Card className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-body-sm text-fg-muted">{label}</p>
        <p className="mt-1 font-mono text-h1 tabular-nums text-fg">{value}</p>
        {hint && <p className="mt-1 text-caption text-fg-muted">{hint}</p>}
      </div>
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-md",
          tone === "warning" ? "bg-warning-soft text-warning" : "bg-surface-muted text-fg-muted",
        )}
      >
        <Icon aria-hidden className="size-5" />
      </span>
    </Card>
  );
}
