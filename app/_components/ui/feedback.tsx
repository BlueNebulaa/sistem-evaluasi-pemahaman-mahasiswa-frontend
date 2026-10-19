import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Empty state: satu kalimat + satu aksi. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      <span className="grid size-12 place-items-center rounded-full bg-surface-muted text-fg-muted">
        <Icon aria-hidden className="size-6" />
      </span>
      <p className="mt-4 max-w-[48ch] text-body font-semibold text-fg">{title}</p>
      {description && <p className="mt-1 max-w-[56ch] text-body-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton rounded-sm", className)} />;
}
