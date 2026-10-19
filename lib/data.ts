import reviewJson from "@/data/review_result.json";
import {
  ASSESSMENTS,
  BASE_SUBMISSION_ID,
  buildMockReview,
  REVIEW_SUPPLEMENT,
  SUBMISSIONS,
} from "./mock-data";
import { normalizeReview, type Review } from "./normalize-review";
import type { RawReviewResult } from "./review";

// Lapisan data. Sementara membaca file lokal dan mock; ganti isi fungsi dengan fetch ke API backend.

const baseReview: RawReviewResult = reviewJson;

export async function getSubmissions() {
  return SUBMISSIONS;
}

export async function getSubmission(id: string) {
  return SUBMISSIONS.find((s) => s.id === id) ?? null;
}

/** Mengembalikan null bila submission masih diproses AI (belum ada hasil review). */
export async function getReview(submissionId: string): Promise<Review | null> {
  const submission = await getSubmission(submissionId);
  if (!submission || submission.status === "processing") return null;
  const raw = submission.id === BASE_SUBMISSION_ID ? baseReview : buildMockReview(baseReview, submission);
  return normalizeReview(raw, REVIEW_SUPPLEMENT);
}

export async function getClassSummary() {
  const submissions = await getSubmissions();
  const scored = submissions.filter((s) => s.totalScore !== null);
  return {
    submissionCount: submissions.length,
    pendingReviewCount: submissions.filter((s) => s.status === "needs-review").length,
    averageTotal: scored.length
      ? scored.reduce((sum, s) => sum + (s.totalScore ?? 0), 0) / scored.length
      : null,
    flaggedSubmissionCount: submissions.filter((s) => s.flagCount > 0).length,
    flagCount: submissions.reduce((sum, s) => sum + s.flagCount, 0),
  };
}

export async function getAssessments() {
  return ASSESSMENTS;
}

export async function getAssessment(id: string) {
  return ASSESSMENTS.find((a) => a.id === id) ?? null;
}
