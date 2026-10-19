import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** student = padding 24px, lecturer = 16px, none = padding diatur sendiri. */
type Density = "student" | "lecturer" | "none";

const DENSITY: Record<Density, string> = {
  student: "p-6",
  lecturer: "p-4",
  none: "",
};

export function Card({
  density = "lecturer",
  className,
  ...props
}: ComponentProps<"div"> & { density?: Density }) {
  return (
    <div
      className={cn("rounded-lg border border-line bg-surface shadow-xs", DENSITY[density], className)}
      {...props}
    />
  );
}
