import { Eye, Flag, Gauge, Inbox } from "lucide-react";
import type { Metadata } from "next";
import { StatCard } from "@/app/_components/lecturer/stat-card";
import { SubmissionTable } from "@/app/_components/lecturer/submission-table";
import { ButtonLink } from "@/app/_components/ui/button";
import { getClassSummary, getSubmissions } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { LECTURER } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Dashboard kelas" };

export default async function DashboardPage() {
  const [summary, submissions] = await Promise.all([getClassSummary(), getSubmissions()]);

  return (
    <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption text-fg-muted">{LECTURER.courseLabel}</p>
          <h1 className="mt-1 text-h1 text-fg">Dashboard kelas</h1>
        </div>
        <ButtonLink href="/dosen/antrian" variant="primary">
          Buka antrian review
        </ButtonLink>
      </div>

      <section aria-label="Ringkasan" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jumlah submission" value={String(summary.submissionCount)} icon={Inbox} />
        <StatCard
          label="Menunggu tinjauan"
          value={String(summary.pendingReviewCount)}
          hint="Perlu keputusan Anda"
          icon={Eye}
          tone="warning"
        />
        <StatCard
          label="Rata-rata skor total"
          value={summary.averageTotal === null ? "–" : formatNumber(summary.averageTotal, 1)}
          hint="Dari submission yang sudah dinilai"
          icon={Gauge}
        />
        <StatCard
          label="Flag integritas"
          value={String(summary.flagCount)}
          hint={`Pada ${summary.flaggedSubmissionCount} submission`}
          icon={Flag}
          tone="warning"
        />
      </section>

      <section aria-labelledby="submission" className="mt-8">
        <h2 id="submission" className="mb-4 text-h2 text-fg">
          Submission
        </h2>
        <SubmissionTable submissions={submissions} caption="Daftar submission kelas" />
      </section>
    </div>
  );
}
