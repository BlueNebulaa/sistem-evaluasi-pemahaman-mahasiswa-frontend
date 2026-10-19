export type ReviewStatus = "needs-review" | "approved" | "processing" | "failed";

// Daftar lengkap nilai `decision` dari backend belum dikonfirmasi (lihat DESIGN_GUIDE.md).
// Nilai yang tidak dikenal diarahkan ke tinjauan dosen, karena itu pilihan paling aman.
const DECISION_STATUS: Record<string, ReviewStatus> = {
  "need human": "needs-review",
  approved: "approved",
  approve: "approved",
  accepted: "approved",
  processing: "processing",
  pending: "processing",
  failed: "failed",
  error: "failed",
};

export function decisionToStatus(decision: string): ReviewStatus {
  return DECISION_STATUS[decision.trim().toLowerCase()] ?? "needs-review";
}
