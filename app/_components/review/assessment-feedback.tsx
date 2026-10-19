import { ArrowUp, Lightbulb, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AssessmentFeedback as Feedback } from "@/lib/normalize-review";

/**
 * Isi penilaian AI: feedback, kekuatan vs yang bisa ditingkatkan, dan rekomendasi.
 * Ikon plus / panah naik, bukan centang hijau vs silang merah.
 */
export function AssessmentFeedback({
  assessment,
  audience,
}: {
  assessment: Feedback;
  audience: "student" | "lecturer";
}) {
  const student = audience === "student";
  const text = student ? "text-body-lg" : "text-body";
  const listText = student ? "text-body" : "text-body-sm";

  return (
    <div className={cn("space-y-5", !student && "space-y-4")}>
      {assessment.feedback ? (
        <p className={cn("max-w-[72ch] text-fg", text)}>{assessment.feedback}</p>
      ) : (
        <p className="text-body-sm text-fg-muted">Belum ada catatan penilaian untuk jawaban ini.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className={cn("font-semibold text-fg", listText)}>{student ? "Kekuatanmu" : "Kekuatan"}</h4>
          {assessment.strengths.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {assessment.strengths.map((item) => (
                <li key={item} className={cn("flex items-start gap-2 text-fg", listText)}>
                  <Plus aria-hidden className="mt-0.5 size-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className={cn("mt-2 text-fg-muted", listText)}>Belum ada catatan.</p>
          )}
        </div>
        <div>
          <h4 className={cn("font-semibold text-fg", listText)}>Yang bisa ditingkatkan</h4>
          {assessment.weaknesses.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {assessment.weaknesses.map((item) => (
                <li key={item} className={cn("flex items-start gap-2 text-fg", listText)}>
                  <ArrowUp aria-hidden className="mt-0.5 size-4 text-fg-muted" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className={cn("mt-2 text-fg-muted", listText)}>Tidak ada catatan perbaikan untuk jawaban ini.</p>
          )}
        </div>
      </div>

      {assessment.recommendation && (
        <div className={cn("flex items-start gap-3 rounded-lg bg-primary-soft", student ? "p-4" : "p-3")}>
          <Lightbulb aria-hidden className="mt-0.5 size-5 text-primary" />
          <div>
            <p className={cn("font-semibold text-fg", listText)}>{student ? "Saran belajar" : "Rekomendasi"}</p>
            <p className={cn("mt-0.5 max-w-[72ch] text-fg", listText)}>{assessment.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
