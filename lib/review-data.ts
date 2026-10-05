import reviewJson from "@/data/review_result.json";
import type { ReviewResult } from "./review";

// Sementara membaca file lokal; ganti dengan fetch ke API backend saat sudah tersedia.
export async function getReviewResult(): Promise<ReviewResult> {
  return reviewJson;
}

export type SessionInfo = {
  studentName: string;
  studentId: string;
  courseName: string;
  courseOptions: string[];
  reviewerInitials: string;
  video: {
    fileName: string;
    durationLabel: string;
    sizeLabel: string;
  };
};

// Data sesi ini belum ada di review_result.json, jadi masih di-mock sesuai desain.
export async function getSessionInfo(): Promise<SessionInfo> {
  return {
    studentName: "Andi Pratama",
    studentId: "2201045",
    courseName: "Struktur Data",
    courseOptions: ["Struktur Data — Kelas A", "Struktur Data — Kelas B"],
    reviewerInitials: "NI",
    video: {
      fileName: "ujian-lisan_andi-pratama_2201.mp4",
      durationLabel: "12:34 menit",
      sizeLabel: "186 MB",
    },
  };
}
