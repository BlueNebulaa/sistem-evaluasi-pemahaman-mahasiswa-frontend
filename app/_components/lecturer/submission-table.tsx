"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Flag, Inbox, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { ReviewStatus } from "@/lib/decision";
import { formatDateTime } from "@/lib/format";
import type { Submission } from "@/lib/mock-data";
import { STATUS_LABELS, StatusBadge } from "../ui/badges";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/feedback";

type Filter = "all" | ReviewStatus;
type SortKey = "student" | "topic" | "total" | "interview" | "flags" | "status" | "assessedAt";
type Sort = { key: SortKey; dir: "asc" | "desc" };

const FILTERS: Filter[] = ["needs-review", "processing", "approved", "all"];
const STATUS_ORDER: Record<ReviewStatus, number> = { "needs-review": 0, processing: 1, failed: 2, approved: 3 };

function compare(a: Submission, b: Submission, key: SortKey) {
  // Nilai kosong (masih diproses) selalu di bawah.
  const num = (x: number | null, y: number | null) => (x ?? -1) - (y ?? -1);
  switch (key) {
    case "student":
      return a.studentName.localeCompare(b.studentName, "id");
    case "topic":
      return a.topic.localeCompare(b.topic, "id");
    case "total":
      return num(a.totalScore, b.totalScore);
    case "interview":
      return num(a.interviewScore, b.interviewScore);
    case "flags":
      return a.flagCount - b.flagCount;
    case "status":
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    case "assessedAt":
      return (a.assessedAt ?? "9999").localeCompare(b.assessedAt ?? "9999");
  }
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  sort: Sort;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sort.key === sortKey;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn("h-10 px-4 font-semibold", align === "right" ? "text-right" : "text-left")}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 rounded-sm text-caption hover:text-fg",
          active ? "text-fg" : "text-fg-muted",
          align === "right" && "flex-row-reverse",
        )}
      >
        {label}
        <Icon aria-hidden className={cn("size-4", !active && "opacity-60")} />
      </button>
    </th>
  );
}

/** DataTable submission: header sticky, sort, filter status, baris 48px. */
export function SubmissionTable({
  submissions,
  defaultFilter = "needs-review",
  caption,
  maxHeightClass = "max-h-[calc(100dvh-16rem)]",
}: {
  submissions: Submission[];
  defaultFilter?: Filter;
  caption: string;
  maxHeightClass?: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const [query, setQuery] = useState("");
  // Default: yang paling lama menunggu di atas.
  const [sort, setSort] = useState<Sort>({ key: "assessedAt", dir: "asc" });

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: submissions.length, "needs-review": 0, approved: 0, processing: 0, failed: 0 };
    submissions.forEach((s) => (result[s.status] += 1));
    return result;
  }, [submissions]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions
      .filter((s) => filter === "all" || s.status === filter)
      .filter((s) => !q || s.studentName.toLowerCase().includes(q) || s.nim.includes(q))
      .sort((a, b) => compare(a, b, sort.key) * (sort.dir === "asc" ? 1 : -1));
  }, [submissions, filter, query, sort]);

  const onSort = (key: SortKey) =>
    setSort((current) => (current.key === key ? { key, dir: current.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filter status" className="flex flex-wrap gap-1 rounded-md bg-surface-muted p-1">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-sm px-3 text-body-sm font-medium transition-colors duration-(--motion-fast) ease-standard",
                filter === value ? "bg-surface text-fg shadow-xs" : "text-fg-muted hover:text-fg",
              )}
            >
              {value === "all" ? "Semua" : STATUS_LABELS[value]}
              <span className="font-mono text-caption tabular-nums text-fg-muted">{counts[value]}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <label htmlFor="cari-mahasiswa" className="sr-only">
            Cari mahasiswa atau NIM
          </label>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
          <input
            id="cari-mahasiswa"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau NIM"
            className="h-10 w-full rounded-sm border border-line bg-surface pl-9 pr-3 text-body-sm text-fg placeholder:text-fg-muted focus:border-primary"
          />
        </div>
      </div>

      <p aria-live="polite" className="mt-3 text-caption text-fg-muted">
        Menampilkan {rows.length} dari {submissions.length} submission
      </p>

      <div className={cn("mt-2 overflow-auto rounded-lg border border-line bg-surface shadow-xs", maxHeightClass)}>
        <table className="w-full min-w-[960px] border-collapse text-body-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 z-10 bg-surface-muted">
            <tr>
              <SortHeader label="Mahasiswa" sortKey="student" sort={sort} onSort={onSort} />
              <SortHeader label="Materi" sortKey="topic" sort={sort} onSort={onSort} />
              <SortHeader label="Skor total" sortKey="total" sort={sort} onSort={onSort} align="right" />
              <SortHeader label="Skor interview" sortKey="interview" sort={sort} onSort={onSort} align="right" />
              <SortHeader label="Flag integritas" sortKey="flags" sort={sort} onSort={onSort} />
              <SortHeader label="Status" sortKey="status" sort={sort} onSort={onSort} />
              <SortHeader label="Dinilai" sortKey="assessedAt" sort={sort} onSort={onSort} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    icon={Inbox}
                    title="Tidak ada submission yang cocok dengan filter ini."
                    action={
                      <Button
                        onClick={() => {
                          setFilter("all");
                          setQuery("");
                        }}
                      >
                        Tampilkan semua
                      </Button>
                    }
                  />
                </td>
              </tr>
            ) : (
              rows.map((s) => {
                const href = `/dosen/review/${s.id}`;
                return (
                  <tr
                    key={s.id}
                    onClick={(e) => {
                      if (!(e.target as HTMLElement).closest("a")) router.push(href);
                    }}
                    className="h-12 cursor-pointer border-t border-line transition-colors duration-(--motion-fast) ease-standard hover:bg-surface-muted"
                  >
                    <td className="px-4 py-2">
                      <Link href={href} className="block rounded-sm font-medium text-fg hover:text-primary">
                        {s.studentName}
                      </Link>
                      <span className="font-mono text-caption text-fg-muted">{s.nim}</span>
                    </td>
                    <td className="px-4 py-2 text-fg">
                      {s.topic}
                      {s.attempt > 1 && <span className="ml-2 text-caption text-fg-muted">Percobaan {s.attempt}</span>}
                    </td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums text-fg">{s.totalScore ?? "–"}</td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums text-fg">{s.interviewScore ?? "–"}</td>
                    <td className="px-4 py-2">
                      {s.flagCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-warning">
                          <Flag aria-hidden className="size-4" />
                          <span className="font-mono tabular-nums">{s.flagCount}</span>
                          <span className="sr-only">pertanyaan dengan sinyal integritas</span>
                        </span>
                      ) : (
                        <span className="text-fg-muted">
                          –<span className="sr-only">Tidak ada</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-fg-muted">
                      {s.assessedAt ? formatDateTime(s.assessedAt) : "–"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
