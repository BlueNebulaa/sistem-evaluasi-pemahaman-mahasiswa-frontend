import { CircleCheck, Hourglass } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountUp } from "@/app/_components/student/count-up";
import { ResultQuestionCard } from "@/app/_components/student/result-question-card";
import { AIBadge, Badge } from "@/app/_components/ui/badges";
import { BackLink } from "@/app/_components/ui/brand";
import { ButtonLink } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { EmptyState } from "@/app/_components/ui/feedback";
import { getAssessment, getReview } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Hasil asesmen" };

export default async function ResultPage({ params }: PageProps<"/asesmen/[id]/hasil">) {
  const { id } = await params;
  const assessment = await getAssessment(id);
  if (!assessment) notFound();

  const review =
    assessment.status === "result-ready" && assessment.submissionId
      ? await getReview(assessment.submissionId)
      : null;

  if (!review) {
    return (
      <>
        <BackLink href="/asesmen">Asesmen saya</BackLink>
        <Card density="none" className="mt-4">
          <EmptyState
            icon={Hourglass}
            title="Hasilmu belum tersedia."
            description="Jawabanmu sedang dinilai atau menunggu tinjauan dosen. Kami akan memberi notifikasi saat hasil siap."
            action={
              <ButtonLink href={`/asesmen/${assessment.id}/status`} variant="primary" size="lg">
                Lihat status
              </ButtonLink>
            }
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <BackLink href="/asesmen">Asesmen saya</BackLink>
      <p className="mt-4 text-caption text-fg-muted">
        {assessment.course} · {assessment.topic}
      </p>
      <h1 className="mt-1 text-h1 text-fg">Hasil asesmenmu</h1>

      <Card density="student" className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-body font-medium text-fg-muted">Skor total</p>
            <p className="mt-1 flex items-baseline gap-1 text-fg">
              <span className="font-mono text-display tabular-nums">
                <CountUp value={review.scores.total} />
              </span>
              <span className="font-mono text-body-lg text-fg-muted">/100</span>
            </p>
          </div>
          <dl className="flex gap-8">
            <div>
              <dt className="text-body-sm text-fg-muted">Project</dt>
              <dd className="font-mono text-h3 tabular-nums text-fg">{review.scores.project}</dd>
            </div>
            <div>
              <dt className="text-body-sm text-fg-muted">Interview</dt>
              <dd className="font-mono text-h3 tabular-nums text-fg">{review.scores.interview}</dd>
            </div>
          </dl>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <Badge tone="success" icon={CircleCheck}>
            Ditinjau dosen
          </Badge>
          <AIBadge reviewed />
          {review.reviewedAt && (
            <span className="text-body-sm text-fg-muted">Dinilai {formatDateTime(review.reviewedAt)}</span>
          )}
        </div>
      </Card>

      <section aria-labelledby="masukan" className="mt-10">
        <h2 id="masukan" className="text-h2 text-fg">
          Masukan per pertanyaan
        </h2>
        <p className="mt-2 max-w-[60ch] text-body-lg text-fg-muted">
          Lihat apa yang sudah kuat dan apa yang bisa kamu tingkatkan di setiap jawaban.
        </p>
        <ul className="mt-6 space-y-4">
          {review.questions.map((question, i) => (
            <li key={question.id}>
              <ResultQuestionCard question={question} scale={review.scale} defaultOpen={i === 0} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
