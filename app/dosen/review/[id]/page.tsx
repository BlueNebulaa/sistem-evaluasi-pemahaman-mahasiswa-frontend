import { LoaderCircle } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewWorkspace } from "@/app/_components/review/review-workspace";
import { StatusBadge } from "@/app/_components/ui/badges";
import { BackLink } from "@/app/_components/ui/brand";
import { ButtonLink } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { EmptyState } from "@/app/_components/ui/feedback";
import { getReview, getSubmission } from "@/lib/data";
import { LECTURER } from "@/lib/mock-data";

export async function generateMetadata({ params }: PageProps<"/dosen/review/[id]">): Promise<Metadata> {
  const submission = await getSubmission((await params).id);
  return { title: submission ? `Review ${submission.studentName}` : "Review" };
}

export default async function ReviewPage({ params }: PageProps<"/dosen/review/[id]">) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();
  const review = await getReview(id);

  if (!review) {
    return (
      <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6">
        <BackLink href="/dosen/antrian">Antrian</BackLink>
        <h1 className="mt-1 text-h2 text-fg">
          {submission.studentName}
          <span className="font-normal text-fg-muted"> · {submission.course}</span>
        </h1>
        <div className="mt-3">
          <StatusBadge status={submission.status} />
        </div>
        <Card density="none" className="mt-6">
          <EmptyState
            icon={LoaderCircle}
            title="Submission ini masih diproses AI."
            description="Halaman review tersedia setelah transkripsi, penilaian, dan pemeriksaan integritas selesai."
            action={<ButtonLink href="/dosen/antrian">Kembali ke antrian</ButtonLink>}
          />
        </Card>
      </div>
    );
  }

  return <ReviewWorkspace review={review} submission={submission} reviewerName={LECTURER.name} />;
}
