import { LecturerShell } from "@/app/_components/lecturer/lecturer-shell";
import { getClassSummary } from "@/lib/data";
import { LECTURER } from "@/lib/mock-data";

export default async function LecturerLayout({ children }: LayoutProps<"/dosen">) {
  const summary = await getClassSummary();
  return (
    <LecturerShell lecturer={LECTURER} pendingCount={summary.pendingReviewCount}>
      {children}
    </LecturerShell>
  );
}
