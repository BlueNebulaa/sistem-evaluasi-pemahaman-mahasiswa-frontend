"use client";

import { ArrowRight, Mic, ScanEye, ScanSearch, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const ANALYSES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Mic, title: "Suara", body: "diubah menjadi transkrip untuk menilai pemahamanmu." },
  { icon: ScanEye, title: "Wajah dan gerak mata", body: "untuk memastikan kamu menjawab sendiri." },
  { icon: ScanSearch, title: "Objek di sekitarmu", body: "seperti ponsel atau buku yang terlihat di kamera." },
];

/** Persetujuan analisis video (prinsip UU Pelindungan Data Pribadi), wajib sebelum upload. */
export function ConsentForm({ assessmentId }: { assessmentId: string }) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <Card density="student">
      <h2 className="text-h3 text-fg">Persetujuan analisis video</h2>
      <p className="mt-2 text-body-lg text-fg-muted">
        Agar penilaian adil, sistem akan menganalisis videomu:
      </p>
      <ul className="mt-4 space-y-3">
        {ANALYSES.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-start gap-3 text-body-lg">
            <Icon aria-hidden className="mt-1 size-5 text-primary" />
            <span>
              <span className="font-semibold text-fg">{title}</span>{" "}
              <span className="text-fg-muted">{body}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-[72ch] text-body-sm text-fg-muted">
        Video hanya dipakai untuk penilaian mata kuliah ini, dapat dilihat dosen pengampu, dan
        diproses sesuai UU Pelindungan Data Pribadi. Skor dari AI selalu ditinjau dosen sebelum
        menjadi nilai.
      </p>

      <label className="mt-6 flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-line p-4 transition-colors duration-(--motion-fast) ease-standard has-checked:border-primary has-checked:bg-primary-soft">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-primary"
        />
        <span className="text-body text-fg">
          Saya mengerti dan setuju video saya dianalisis seperti dijelaskan di atas.
        </span>
      </label>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Button
          variant="primary"
          size="lg"
          disabled={!agreed}
          aria-describedby={agreed ? undefined : "consent-hint"}
          onClick={() => router.push(`/asesmen/${assessmentId}/unggah`)}
        >
          Lanjut ke upload
          <ArrowRight aria-hidden />
        </Button>
        {!agreed && (
          <p id="consent-hint" className="text-body-sm text-fg-muted">
            Centang persetujuan untuk melanjutkan.
          </p>
        )}
      </div>
    </Card>
  );
}
