import { BellRing } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlowSteps } from "@/app/_components/student/flow-steps";
import { ProcessingChecklist } from "@/app/_components/student/processing-checklist";
import { BackLink } from "@/app/_components/ui/brand";
import { ButtonLink } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { getAssessment } from "@/lib/data";

export const metadata: Metadata = { title: "Status penilaian" };

export default async function StatusPage({ params }: PageProps<"/asesmen/[id]/status">) {
  const { id } = await params;
  const assessment = await getAssessment(id);
  if (!assessment) notFound();

  return (
    <>
      <BackLink href="/asesmen">Asesmen saya</BackLink>
      <div className="mt-4">
        <FlowSteps current={2} />
      </div>

      <p className="text-caption text-fg-muted">
        {assessment.course} · {assessment.topic}
      </p>
      <h1 className="mt-1 text-h1 text-fg">Videomu sudah kami terima</h1>
      <p className="mt-2 max-w-[60ch] text-body-lg text-fg-muted">
        Sedang menilai jawabanmu, biasanya 3–5 menit. Setelah itu dosen akan meninjau hasilnya.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-lg bg-surface-muted p-4">
        <BellRing aria-hidden className="mt-0.5 size-5 text-fg-muted" />
        <p className="text-body text-fg">
          Kamu boleh menutup halaman ini; kami akan memberi notifikasi saat hasil siap.
        </p>
      </div>

      <Card density="student" className="mt-6">
        <ProcessingChecklist />
      </Card>

      <div className="mt-8">
        <ButtonLink href="/asesmen" size="lg" className="w-full sm:w-auto">
          Kembali ke asesmen saya
        </ButtonLink>
      </div>
    </>
  );
}
