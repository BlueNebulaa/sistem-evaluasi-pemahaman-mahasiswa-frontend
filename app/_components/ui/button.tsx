import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
/** md = 40px (sisi dosen), lg = 48px (sisi mahasiswa), icon = tombol ikon 40px. */
type Size = "md" | "lg" | "icon";

type ButtonStyleProps = { variant?: Variant; size?: Size; className?: string };

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-on-primary shadow-xs hover:bg-primary-hover",
  secondary: "border border-line bg-surface text-fg shadow-xs hover:bg-surface-muted",
  ghost: "text-fg hover:bg-surface-muted",
  danger: "bg-danger text-on-danger shadow-xs hover:opacity-90",
};

const SIZES: Record<Size, string> = {
  md: "h-10 px-4 text-body-sm",
  lg: "h-12 px-5 text-body",
  icon: "size-10",
};

export function buttonClasses({ variant = "secondary", size = "md", className }: ButtonStyleProps) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold",
    "transition-colors duration-(--motion-fast) ease-standard",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
