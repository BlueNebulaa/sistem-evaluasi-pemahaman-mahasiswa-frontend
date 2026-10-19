import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlowSteps } from "@/app/_components/student/flow-steps";
import { UploadDropzone } from "@/app/_components/student/upload-dropzone";
import { BackLink } from "@/app/_components/ui/brand";
import { getAssessment } from "@/lib/data";

export const metadata: Metadata = { title: "Unggah video" };

export default async function UploadPage({ params }: PageProps<"/asesmen/[id]/unggah">) {
  const { id } = await params;
  const assessment = await getAssessment(id);
  if (!assessment) notFound();

  return (
    <>
      <BackLink href={`/asesmen/${assessment.id}/panduan`}>Panduan</BackLink>
      <div className="mt-4">
        <FlowSteps current={1} />
      </div>

      <p className="text-caption text-fg-muted">
        {assessment.course} · {assessment.topic}
      </p>
      <h1 className="mt-1 text-h1 text-fg">Unggah video jawabanmu</h1>
      <p className="mb-8 mt-2 max-w-[60ch] text-body-lg text-fg-muted">
        Pastikan semua {assessment.questions.length} pertanyaan sudah kamu jawab di video. Kamu bisa
        memutar ulang video sebelum mengirim.
      </p>

      <UploadDropzone assessmentId={assessment.id} maxDurationMin={assessment.maxDurationMin} />
    </>
  );
}
