import { averageScore, isFlagged, NEED_HUMAN_DECISION } from "@/lib/review";
import { getReviewResult, getSessionInfo } from "@/lib/review-data";
import { AnalysisPipeline } from "./_components/analysis-pipeline";
import { AppHeader } from "./_components/app-header";
import { AssessorCard } from "./_components/assessor-card";
import { QuestionList } from "./_components/question-list";
import { ReviewerNotes } from "./_components/reviewer-notes";
import { StatCard } from "./_components/ui";
import { VideoUpload } from "./_components/video-upload";

const REVIEWER_NOTES_ID = "catatan-reviewer";

export default async function Home() {
  const [review, session] = await Promise.all([getReviewResult(), getSessionInfo()]);
  const { project: projectFindings, interviews } = review.reviewChecklistResult;
  const flaggedCount = interviews.scores.filter(isFlagged).length;
  const average = averageScore(interviews.scores).toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const studentLabel = `${session.studentName} · NIM ${session.studentId}`;

  return (
    <>
      <AppHeader courseOptions={session.courseOptions} userInitials={session.reviewerInitials} />

      <main className="flex-1">
        <section className="bg-white px-6 pb-9 pt-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600">
              Ujian Lisan · Analisis berbasis AI
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-[34px]">
              Seberapa paham mahasiswa terhadap materi?
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-[15px]">
              Unggah video penjelasan mahasiswa. Sistem akan mentranskripsi jawaban, menilai
              pemahaman dengan LLM, menganalisis bahasa non-verbal, dan mendeteksi indikasi
              kecurangan.
            </p>
          </div>
          <div className="mx-auto mt-6 max-w-[740px]">
            <VideoUpload
              initialVideo={{
                fileName: session.video.fileName,
                meta: `${studentLabel} · ${session.video.durationLabel} · ${session.video.sizeLabel}`,
                status: "analyzed",
              }}
            />
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-[1010px] space-y-5">
            <AssessorCard
              review={review}
              subtitle={`${session.studentName} (NIM ${session.studentId}) · ${session.courseName}`}
              reviewerNotesHref={`#${REVIEWER_NOTES_ID}`}
            />

            <AnalysisPipeline />

            <div className="grid gap-5 sm:grid-cols-3">
              <StatCard
                label="Project"
                value={review.scoresOverview.project}
                caption={
                  projectFindings.length === 0
                    ? "Checklist project: tidak ada temuan"
                    : `Checklist project: ${projectFindings.length} temuan`
                }
                captionTone={projectFindings.length === 0 ? "success" : "warning"}
              />
              <StatCard
                label="Interview"
                value={review.scoresOverview.interview}
                caption={`Rata-rata ${average} dari skala ${interviews.minScore}–${interviews.maxScore} · ${interviews.scores.length} pertanyaan`}
                captionTone="info"
              />
              <StatCard
                label="Total"
                value={review.scoresOverview.total}
                caption={
                  flaggedCount > 0
                    ? `${flaggedCount} pertanyaan perlu dicek manual`
                    : "Tidak ada pertanyaan yang perlu dicek manual"
                }
                captionTone={flaggedCount > 0 ? "warning" : "success"}
              />
            </div>

            <QuestionList interviews={interviews} />

            <ReviewerNotes
              id={REVIEWER_NOTES_ID}
              initialNotes={review.notes}
              decision={review.decision}
              notesRequired={review.decision === NEED_HUMAN_DECISION}
            />
          </div>
        </section>
      </main>
    </>
  );
}
