"use client";

import { useState, type ReactNode } from "react";
import { isFlagged, type InterviewChecklist } from "@/lib/review";
import { QuestionCard } from "./question-card";

type Filter = "all" | "flagged";

export function QuestionList({ interviews }: { interviews: InterviewChecklist }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { minScore, maxScore, scores } = interviews;

  const items = scores.map((item, index) => ({ item, number: index + 1, flagged: isFlagged(item) }));
  const flaggedCount = items.filter((entry) => entry.flagged).length;
  const visibleItems = filter === "flagged" ? items.filter((entry) => entry.flagged) : items;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Skor interview per pertanyaan</h2>
          <p className="text-xs text-slate-500">
            Setiap jawaban dinilai AI dengan skala minScore {minScore} – maxScore {maxScore}
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Filter pertanyaan">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            Semua ({items.length})
          </FilterChip>
          <FilterChip active={filter === "flagged"} onClick={() => setFilter("flagged")} warning>
            Perlu dicek ({flaggedCount})
          </FilterChip>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">
          Tidak ada pertanyaan yang perlu dicek manual.
        </p>
      ) : (
        <div className="space-y-3">
          {visibleItems.map(({ item, number, flagged }) => (
            <QuestionCard
              key={item.id}
              item={item}
              number={number}
              flagged={flagged}
              minScore={minScore}
              maxScore={maxScore}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type FilterChipProps = {
  active: boolean;
  warning?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function FilterChip({ active, warning = false, onClick, children }: FilterChipProps) {
  const activeStyle = warning ? "bg-amber-500 text-white" : "bg-slate-900 text-white";
  const idleStyle = warning
    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
    : "bg-white text-slate-700 hover:bg-slate-100";

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${active ? activeStyle : idleStyle}`}
    >
      {children}
    </button>
  );
}
