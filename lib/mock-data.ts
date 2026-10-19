import type { ReviewStatus } from "./decision";
import type { ReviewSupplement } from "./normalize-review";
import type { RawCheatingSignals, RawReviewResult } from "./review";
import { scoreLevel, type ScoreLevel } from "./score";

// Data contoh untuk prototipe. Semua isi file ini diganti respons API saat backend siap.

export const LECTURER = {
  name: "Dr. Sari Wulandari",
  initials: "SW",
  courseLabel: "Struktur Data · Kelas A",
};

export const STUDENT = {
  name: "Andi Pratama",
  firstName: "Andi",
  initials: "AP",
  nim: "2201045",
};

export type Submission = {
  id: string;
  studentName: string;
  nim: string;
  course: string;
  topic: string;
  attempt: number;
  totalScore: number | null;
  projectScore: number | null;
  interviewScore: number | null;
  /** Jumlah pertanyaan yang punya sinyal integritas. */
  flagCount: number;
  status: ReviewStatus;
  assessedAt: string | null;
};

/** Submission yang memakai data/review_result.json apa adanya. */
export const BASE_SUBMISSION_ID = "sub-2201045-1";

const TOPIC = "Pohon biner & BST";

export const SUBMISSIONS: Submission[] = [
  { id: BASE_SUBMISSION_ID, studentName: "Andi Pratama", nim: "2201045", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: 85, projectScore: 100, interviewScore: 75, flagCount: 1, status: "needs-review", assessedAt: "2026-10-03T10:42:15+07:00" },
  { id: "sub-2201012-1", studentName: "Siti Nurhaliza", nim: "2201012", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: 93, projectScore: 100, interviewScore: 88, flagCount: 0, status: "approved", assessedAt: "2026-10-02T14:10:00+07:00" },
  { id: "sub-2201078-1", studentName: "Budi Santoso", nim: "2201078", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: 66, projectScore: 90, interviewScore: 50, flagCount: 2, status: "needs-review", assessedAt: "2026-10-03T09:15:00+07:00" },
  { id: "sub-2201033-1", studentName: "Dewi Lestari", nim: "2201033", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: 79, projectScore: 95, interviewScore: 63, flagCount: 0, status: "needs-review", assessedAt: "2026-10-04T08:30:00+07:00" },
  { id: "sub-2201091-1", studentName: "Rizky Ramadhan", nim: "2201091", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: null, projectScore: null, interviewScore: null, flagCount: 0, status: "processing", assessedAt: null },
  { id: "sub-2201056-1", studentName: "Putri Ayu Wulandari", nim: "2201056", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: 88, projectScore: 95, interviewScore: 81, flagCount: 0, status: "approved", assessedAt: "2026-10-02T16:45:00+07:00" },
  { id: "sub-2201067-2", studentName: "Fajar Nugroho", nim: "2201067", course: "Struktur Data", topic: TOPIC, attempt: 2, totalScore: 72, projectScore: 85, interviewScore: 56, flagCount: 1, status: "needs-review", assessedAt: "2026-10-05T11:20:00+07:00" },
  { id: "sub-2201004-1", studentName: "Anisa Rahma", nim: "2201004", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: 96, projectScore: 100, interviewScore: 94, flagCount: 0, status: "approved", assessedAt: "2026-10-01T13:05:00+07:00" },
  { id: "sub-2201082-1", studentName: "Yoga Prasetyo", nim: "2201082", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: 70, projectScore: 90, interviewScore: 56, flagCount: 0, status: "needs-review", assessedAt: "2026-10-04T15:40:00+07:00" },
  { id: "sub-2201049-1", studentName: "Maya Sari", nim: "2201049", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: null, projectScore: null, interviewScore: null, flagCount: 0, status: "processing", assessedAt: null },
  { id: "sub-2201021-1", studentName: "Hendra Wijaya", nim: "2201021", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: 84, projectScore: 90, interviewScore: 75, flagCount: 0, status: "approved", assessedAt: "2026-10-02T10:00:00+07:00" },
  { id: "sub-2201038-1", studentName: "Larasati Dewi", nim: "2201038", course: "Struktur Data", topic: TOPIC, attempt: 1, totalScore: 61, projectScore: 85, interviewScore: 44, flagCount: 3, status: "needs-review", assessedAt: "2026-10-05T08:55:00+07:00" },
];

/** Field yang belum dikirim backend: teks pertanyaan, waktu jawaban di video, dan bukti per sinyal. */
export const REVIEW_SUPPLEMENT: ReviewSupplement = {
  videoUrl: null,
  durationSec: 754,
  // Ambang sementara sampai definisi efsPercent/edpPercent dikonfirmasi backend.
  eyeThresholds: { efsPercent: 20, edpPercent: 15 },
  questions: {
    101: {
      title: "Pohon biner",
      prompt: "Jelaskan apa itu pohon biner dan berikan satu contoh penggunaannya.",
      startSec: 0,
      endSec: 212,
      strengths: [
        "Definisi tepat: setiap simpul punya paling banyak dua anak.",
        "Memberi contoh pohon ekspresi yang relevan.",
      ],
      weaknesses: [
        "Belum menyinggung pohon kosong sebagai kasus khusus.",
        "Istilah daun dan simpul internal belum dijelaskan.",
      ],
      recommendation:
        "Latih penjelasan dengan menyebut kasus tepi (pohon kosong, satu simpul) dan istilah dasar seperti akar, daun, dan simpul internal.",
      eyeMomentsSec: [96],
    },
    102: {
      title: "Traversal in-order",
      prompt: "Jelaskan urutan traversal in-order dan analisis kompleksitas waktunya.",
      startSec: 212,
      endSec: 498,
      strengths: ["Urutan traversal in-order (kiri, akar, kanan) disebutkan dengan benar."],
      weaknesses: [
        "Analisis kompleksitas keliru: traversal mengunjungi setiap simpul sekali, jadi O(n), bukan O(log n).",
      ],
      recommendation:
        "Bedakan operasi yang menelusuri satu jalur (O(log n) pada pohon seimbang) dengan operasi yang mengunjungi semua simpul (O(n)).",
      objectTimestamps: { "cell phone": 287, book: 361 },
      eyeMomentsSec: [305, 402],
    },
    103: {
      title: "Binary search tree",
      prompt: "Apa itu binary search tree, dan kapan pencarian di BST bisa berjalan O(log n)?",
      startSec: 498,
      endSec: 754,
      strengths: [
        "Aturan nilai subtree kiri dan kanan dijelaskan lengkap dan akurat.",
        "Menyebut syarat pohon seimbang untuk pencarian O(log n).",
      ],
      weaknesses: [],
      recommendation:
        "Pertahankan. Sebagai pengayaan, pelajari cara AVL tree atau red-black tree menjaga pohon tetap seimbang.",
      objectTimestamps: { book: 611 },
    },
  },
};

const LEVEL_FEEDBACK: Record<
  ScoreLevel,
  { feedback: string; strengths: string[]; weaknesses: string[]; recommendation: string }
> = {
  0: {
    feedback: "Jawaban tentang {topic} belum menjawab inti pertanyaan.",
    strengths: ["Berani mencoba menjawab dengan kata-kata sendiri."],
    weaknesses: ["Konsep utama {topic} belum disebutkan."],
    recommendation: "Pelajari ulang definisi {topic} dari materi kuliah, lalu coba jelaskan dengan satu contoh.",
  },
  1: {
    feedback: "Penjelasan {topic} masih banyak yang belum tepat.",
    strengths: ["Beberapa istilah yang dipakai sudah relevan."],
    weaknesses: ["Definisi {topic} belum tepat.", "Belum ada contoh yang mendukung penjelasan."],
    recommendation: "Mulai dari definisi {topic}, lalu tambahkan satu contoh sederhana.",
  },
  2: {
    feedback: "Konsep dasar {topic} sudah dikenali, tetapi ada bagian penting yang keliru atau terlewat.",
    strengths: ["Konsep dasar {topic} sudah disebutkan."],
    weaknesses: ["Ada bagian penting yang terlewat atau kurang tepat."],
    recommendation: "Bandingkan jawabanmu dengan rangkuman materi {topic} dan tandai bagian yang belum kamu sebut.",
  },
  3: {
    feedback: "Penjelasan {topic} sudah tepat, tetapi masih ada detail yang belum disebutkan.",
    strengths: ["Penjelasan {topic} tepat dan runtut."],
    weaknesses: ["Masih ada detail atau kasus khusus yang belum disebutkan."],
    recommendation: "Tambahkan kasus khusus atau batasan agar penjelasan {topic} lengkap.",
  },
  4: {
    feedback: "Penjelasan {topic} lengkap dan akurat.",
    strengths: ["Penjelasan {topic} lengkap, akurat, dan disertai alasan."],
    weaknesses: [],
    recommendation: "Pertahankan. Coba jelaskan {topic} dengan contoh yang berbeda sebagai latihan.",
  },
};

const CLEAN_SIGNALS: RawCheatingSignals = {
  objectDetection: { hasSuspiciousObject: false, suspiciousObject: [] },
  eyeTracking: { efsPercent: 7.4, edpPercent: 3.9, confidence: 0.92, status: "Normal" },
};

const FLAGGED_SIGNALS: RawCheatingSignals[] = [
  {
    objectDetection: { hasSuspiciousObject: true, suspiciousObject: ["cell phone", "book"] },
    eyeTracking: { efsPercent: 31.5, edpPercent: 22.8, confidence: 0.87, status: "Suspicious" },
  },
  {
    objectDetection: { hasSuspiciousObject: false, suspiciousObject: [] },
    eyeTracking: { efsPercent: 26.3, edpPercent: 18.1, confidence: 0.82, status: "Suspicious" },
  },
  {
    objectDetection: { hasSuspiciousObject: true, suspiciousObject: ["book"] },
    eyeTracking: { efsPercent: 12.2, edpPercent: 8.4, confidence: 0.9, status: "Normal" },
  },
];

// Urutan pertanyaan yang diberi sinyal saat flagCount = 1, 2, 3.
const FLAG_ORDER = [1, 0, 2];
const SCORE_OFFSETS = [0.3, -0.4, 0.1];

/**
 * Membuat review contoh untuk submission selain BASE_SUBMISSION_ID, supaya setiap baris tabel
 * membuka halaman review yang angkanya konsisten dengan baris tersebut.
 */
export function buildMockReview(base: RawReviewResult, submission: Submission): RawReviewResult {
  const { interviews } = base.reviewChecklistResult;
  const scale = { min: interviews.minScore, max: interviews.maxScore };
  const target = ((submission.interviewScore ?? 0) / 100) * scale.max;
  const flagged = new Set(FLAG_ORDER.slice(0, submission.flagCount));

  return {
    ...base,
    decision: submission.status === "approved" ? "Approved" : "Need Human",
    reviewedAt: submission.assessedAt ?? undefined,
    scoresOverview: {
      total: submission.totalScore ?? 0,
      project: submission.projectScore ?? 0,
      interview: submission.interviewScore ?? 0,
    },
    reviewChecklistResult: {
      project: [],
      interviews: {
        ...interviews,
        scores: interviews.scores.map((item, i) => {
          const score = Math.min(scale.max, Math.max(scale.min, Math.round(target + SCORE_OFFSETS[i % 3])));
          const topic = (REVIEW_SUPPLEMENT.questions?.[item.id]?.title ?? "materi ini").toLowerCase();
          const text = LEVEL_FEEDBACK[scoreLevel(score, scale)];
          const fill = (s: string) => s.replaceAll("{topic}", topic);
          return {
            id: item.id,
            score,
            transcript: item.transcript,
            assessmentResult: {
              feedback: fill(text.feedback),
              strengths: text.strengths.map(fill),
              weaknesses: text.weaknesses.map(fill),
              recommendation: fill(text.recommendation),
            },
            cheatingSignals: flagged.has(i) ? FLAGGED_SIGNALS[FLAG_ORDER.indexOf(i)] : CLEAN_SIGNALS,
            speechBehavior: item.aiAssessment?.speechBehavior,
          };
        }),
      },
    },
  };
}

export type AssessmentStatus = "not-started" | "processing" | "result-ready";

export type Assessment = {
  id: string;
  course: string;
  className: string;
  topic: string;
  dueAt: string;
  status: AssessmentStatus;
  questions: string[];
  maxDurationMin: number;
  /** Submission milik mahasiswa ini bila sudah mengirim video. */
  submissionId: string | null;
};

export const ASSESSMENTS: Assessment[] = [
  {
    id: "graf",
    course: "Struktur Data",
    className: "Kelas A",
    topic: "Graf: BFS & DFS",
    dueAt: "2026-10-26T23:59:00+07:00",
    status: "not-started",
    questions: [
      "Jelaskan perbedaan BFS dan DFS beserta struktur data yang dipakai masing-masing.",
      "Kapan BFS lebih tepat dipakai daripada DFS? Beri satu contoh kasus.",
      "Berapa kompleksitas waktu BFS pada graf dengan V simpul dan E sisi, dan mengapa?",
    ],
    maxDurationMin: 15,
    submissionId: null,
  },
  {
    id: "sorting",
    course: "Analisis Algoritma",
    className: "Kelas B",
    topic: "Kompleksitas algoritma sorting",
    dueAt: "2026-11-02T23:59:00+07:00",
    status: "not-started",
    questions: [
      "Bandingkan merge sort dan quick sort dari sisi kompleksitas waktu terbaik dan terburuk.",
      "Mengapa quick sort tetap populer meski kasus terburuknya O(n²)?",
    ],
    maxDurationMin: 10,
    submissionId: null,
  },
  {
    id: "normalisasi",
    course: "Basis Data",
    className: "Kelas A",
    topic: "Normalisasi hingga 3NF",
    dueAt: "2026-10-22T23:59:00+07:00",
    status: "processing",
    questions: [
      "Jelaskan tujuan normalisasi basis data.",
      "Apa perbedaan 2NF dan 3NF? Beri contoh tabel yang melanggar 3NF.",
    ],
    maxDurationMin: 15,
    submissionId: null,
  },
  {
    id: "pohon-biner",
    course: "Struktur Data",
    className: "Kelas A",
    topic: TOPIC,
    dueAt: "2026-10-05T23:59:00+07:00",
    status: "result-ready",
    questions: [
      "Jelaskan apa itu pohon biner dan berikan satu contoh penggunaannya.",
      "Jelaskan urutan traversal in-order dan analisis kompleksitas waktunya.",
      "Apa itu binary search tree, dan kapan pencarian di BST bisa berjalan O(log n)?",
    ],
    maxDurationMin: 15,
    submissionId: BASE_SUBMISSION_ID,
  },
];
