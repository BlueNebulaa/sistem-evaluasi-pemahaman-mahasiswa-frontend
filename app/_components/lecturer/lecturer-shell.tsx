"use client";

import { LayoutDashboard, ListChecks, PanelLeftClose, PanelLeftOpen, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useStoredFlag } from "@/lib/use-stored-flag";
import { Avatar, Logo, MAIN_CONTENT_ID } from "../ui/brand";
import { ThemeToggle } from "../ui/theme-toggle";

type NavItem = { href: string; label: string; icon: LucideIcon; count?: number; match: (path: string) => boolean };

/** Workspace dosen: sidebar kiri 240px yang bisa diciutkan ke 64px; bar atas di layar < 1024px. */
export function LecturerShell({
  children,
  pendingCount,
  lecturer,
}: {
  children: ReactNode;
  pendingCount: number;
  lecturer: { name: string; initials: string; courseLabel: string };
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useStoredFlag("themis-sidebar-collapsed");

  const nav: NavItem[] = [
    { href: "/dosen", label: "Dashboard", icon: LayoutDashboard, match: (p) => p === "/dosen" },
    {
      href: "/dosen/antrian",
      label: "Antrian review",
      icon: ListChecks,
      count: pendingCount,
      match: (p) => p.startsWith("/dosen/antrian") || p.startsWith("/dosen/review"),
    },
  ];

  return (
    <div className="min-h-dvh lg:flex">
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface lg:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div className={cn("flex h-16 items-center", collapsed ? "justify-center" : "px-4")}>
          <Link href="/dosen" aria-label="Themis, ke dashboard" className="rounded-md">
            <Logo hideWordmark={collapsed} />
          </Link>
        </div>

        {!collapsed && (
          <p className="px-4 pb-2 text-caption text-fg-muted">{lecturer.courseLabel}</p>
        )}

        <nav aria-label="Navigasi dosen" className="flex-1 px-2 py-2">
          <ul className="space-y-1">
            {nav.map(({ href, label, icon: Icon, count, match }) => {
              const active = match(pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md text-body-sm font-medium transition-colors duration-(--motion-fast) ease-standard",
                      collapsed ? "justify-center" : "px-3",
                      active ? "bg-primary-soft text-primary" : "text-fg-muted hover:bg-surface-muted hover:text-fg",
                    )}
                  >
                    <Icon aria-hidden className="size-5" />
                    <span className={cn(collapsed && "sr-only")}>{label}</span>
                    {count !== undefined && count > 0 && !collapsed && (
                      <span className="ml-auto rounded-full bg-warning-soft px-2 font-mono text-caption tabular-nums text-warning">
                        {count}
                        <span className="sr-only"> menunggu</span>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={cn("space-y-1 border-t border-line p-2", collapsed && "flex flex-col items-center")}>
          <ThemeToggle showLabel={!collapsed} className={cn(!collapsed && "w-full justify-start")} />
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Lebarkan sidebar" : "Ciutkan sidebar"}
            className={cn(
              "flex h-10 items-center gap-2 rounded-md px-2.5 text-body-sm font-medium text-fg-muted transition-colors duration-(--motion-fast) ease-standard hover:bg-surface-muted hover:text-fg",
              !collapsed && "w-full",
            )}
          >
            {collapsed ? <PanelLeftOpen aria-hidden className="size-5" /> : <PanelLeftClose aria-hidden className="size-5" />}
            {!collapsed && <span>Ciutkan</span>}
          </button>
          <div className={cn("flex items-center gap-3 pt-2", !collapsed && "px-1")}>
            <Avatar initials={lecturer.initials} label={lecturer.name} />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-body-sm font-medium text-fg">{lecturer.name}</p>
                <p className="text-caption text-fg-muted">Dosen</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-surface lg:hidden">
          <div className="flex h-14 items-center gap-2 px-4">
            <Link href="/dosen" aria-label="Themis, ke dashboard" className="mr-2 rounded-md">
              <Logo hideWordmark />
            </Link>
            <nav aria-label="Navigasi dosen" className="flex flex-1 gap-1">
              {nav.map(({ href, label, icon: Icon, match }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={match(pathname) ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-md px-3 text-body-sm font-medium",
                    match(pathname) ? "bg-primary-soft text-primary" : "text-fg-muted hover:bg-surface-muted",
                  )}
                >
                  <Icon aria-hidden className="size-5" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sr-only sm:hidden">{label}</span>
                </Link>
              ))}
            </nav>
            <ThemeToggle />
            <Avatar initials={lecturer.initials} label={lecturer.name} />
          </div>
        </header>
        <main id={MAIN_CONTENT_ID} className="flex flex-1 flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
