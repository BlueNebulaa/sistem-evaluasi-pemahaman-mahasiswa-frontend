import type { Metadata } from "next";
import { getAssessments } from "@/lib/data";
import { STUDENT } from "@/lib/mock-data";
import { AssessmentCard } from "@/app/_components/student/assessment-card";

export const metadata: Metadata = { title: "Asesmen saya" };

export default async function AssessmentsPage() {
  const assessments = await getAssessments();
  const todo = assessments
    .filter((a) => a.status === "not-started")
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const submitted = assessments.filter((a) => a.status !== "not-started");

  return (
    <>
      <h1 className="text-h1 text-fg">Halo, {STUDENT.firstName}</h1>
      <p className="mt-2 max-w-[60ch] text-body-lg text-fg-muted">
        Ini asesmen lisan untukmu. Kerjakan satu per satu, tidak perlu terburu-buru.
      </p>

      <section aria-labelledby="perlu-dikerjakan" className="mt-10">
        <h2 id="perlu-dikerjakan" className="text-h2 text-fg">
          Perlu dikerjakan
        </h2>
        {todo.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {todo.map((assessment) => (
              <li key={assessment.id}>
                <AssessmentCard assessment={assessment} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-body-lg text-fg-muted">
            Semua asesmen sudah kamu kirim. Kerja bagus!
          </p>
        )}
      </section>

      {submitted.length > 0 && (
        <section aria-labelledby="sudah-dikirim" className="mt-12">
          <h2 id="sudah-dikirim" className="text-h2 text-fg">
            Sudah dikirim
          </h2>
          <ul className="mt-4 space-y-4">
            {submitted.map((assessment) => (
              <li key={assessment.id}>
                <AssessmentCard assessment={assessment} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
