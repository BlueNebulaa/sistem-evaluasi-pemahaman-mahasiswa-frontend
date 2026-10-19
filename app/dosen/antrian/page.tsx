import type { Metadata } from "next";
import { SubmissionTable } from "@/app/_components/lecturer/submission-table";
import { getSubmissions } from "@/lib/data";
import { LECTURER } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Antrian review" };

export default async function QueuePage() {
  const submissions = await getSubmissions();

  return (
    <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6">
      <p className="text-caption text-fg-muted">{LECTURER.courseLabel}</p>
      <h1 className="mt-1 text-h1 text-fg">Antrian review</h1>
      <p className="mb-6 mt-2 max-w-[72ch] text-body text-fg-muted">
        Buka submission untuk memeriksa alasan AI, bukti video, dan sinyal integritas sebelum
        menyetujui skor.
      </p>
      <SubmissionTable
        submissions={submissions}
        caption="Antrian review submission"
        maxHeightClass="max-h-[calc(100dvh-15rem)]"
      />
    </div>
  );
}
