import { BookX, ScanFace, SunMedium, VolumeX, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAssessment } from "@/lib/data";
import { ConsentForm } from "@/app/_components/student/consent-form";
import { FlowSteps } from "@/app/_components/student/flow-steps";
import { BackLink } from "@/app/_components/ui/brand";
import { Card } from "@/app/_components/ui/card";

export const metadata: Metadata = { title: "Panduan asesmen" };

const TIPS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: ScanFace, title: "Wajah terlihat", body: "Posisikan kamera sejajar mata, wajah di tengah." },
  { icon: SunMedium, title: "Cahaya cukup", body: "Hadap ke sumber cahaya, bukan membelakanginya." },
  { icon: VolumeX, title: "Ruangan tenang", body: "Matikan musik dan notifikasi di sekitarmu." },
  { icon: BookX, title: "Tanpa catatan", body: "Jauhkan ponsel, buku, dan catatan dari meja." },
];

export default async function GuidePage({ params }: PageProps<"/asesmen/[id]/panduan">) {
  const { id } = await params;
  const assessment = await getAssessment(id);
  if (!assessment) notFound();

  return (
    <>
      <BackLink href="/asesmen">Asesmen saya</BackLink>
      <div className="mt-4">
        <FlowSteps current={0} />
      </div>

      <p className="text-caption text-fg-muted">
        {assessment.course} · {assessment.topic}
      </p>
      <h1 className="mt-1 text-h1 text-fg">Sebelum kamu merekam</h1>
      <p className="mt-2 max-w-[60ch] text-body-lg text-fg-muted">
        Rekam dirimu menjawab semua pertanyaan dalam satu video, maksimal{" "}
        {assessment.maxDurationMin} menit. Santai saja, jelaskan dengan kata-katamu sendiri.
      </p>

      <section aria-labelledby="persiapan" className="mt-10">
        <h2 id="persiapan" className="text-h2 text-fg">
          Siapkan tempatmu
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {TIPS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-start gap-4 rounded-lg border border-line bg-surface p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
                <Icon aria-hidden className="size-6" />
              </span>
              <span>
                <span className="block text-body-lg font-semibold text-fg">{title}</span>
                <span className="mt-0.5 block text-body text-fg-muted">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pertanyaan" className="mt-10">
        <h2 id="pertanyaan" className="text-h2 text-fg">
          Pertanyaan yang perlu kamu jawab
        </h2>
        <p className="mt-2 text-body-lg text-fg-muted">
          Sebutkan nomor pertanyaan sebelum menjawab, agar dosen mudah mengikuti.
        </p>
        <Card density="student" className="mt-4">
          <ol className="space-y-4">
            {assessment.questions.map((question, i) => (
              <li key={question} className="flex gap-4 text-body-lg">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-muted font-mono text-body-sm font-medium text-fg-muted">
                  {i + 1}
                </span>
                <span className="max-w-[72ch] pt-0.5 text-fg">{question}</span>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section className="mt-10">
        <ConsentForm assessmentId={assessment.id} />
      </section>
    </>
  );
}
