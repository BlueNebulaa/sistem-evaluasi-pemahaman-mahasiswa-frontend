import { decisionToStatus, type ReviewStatus } from "./decision";
import type {
  RawAssessmentResult,
  RawCheatingSignals,
  RawInterviewScore,
  RawReviewResult,
  RawSpeechBehavior,
} from "./review";
import type { ScoreScale } from "./score";

// Satu-satunya tempat yang tahu bentuk JSON backend. Jika nama field berubah, perbaiki di sini.

export type TranscriptSegment = {
  id: string;
  questionId: number;
  startSec: number | null;
  endSec: number | null;
  text: string;
};

export type DetectedObject = {
  key: string;
  label: string;
  timestampSec: number | null;
};

export type EyeSignal = {
  efsPercent: number;
  edpPercent: number;
  confidence: number;
  needsReview: boolean;
  thresholds: { efsPercent: number | null; edpPercent: number | null };
  momentsSec: number[];
};

export type SpeechStats = RawSpeechBehavior;

export type AssessmentFeedback = {
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string | null;
  rawScore: number | null;
};

export type ReviewQuestion = {
  id: number;
  index: number;
  title: string | null;
  prompt: string | null;
  score: number;
  transcript: string;
  segments: TranscriptSegment[];
  startSec: number | null;
  endSec: number | null;
  assessment: AssessmentFeedback;
  objects: DetectedObject[];
  eye: EyeSignal | null;
  speech: SpeechStats | null;
  flagged: boolean;
};

export type IntegrityMarker = {
  id: string;
  questionId: number;
  timestampSec: number;
  label: string;
};

export type Review = {
  decision: string;
  status: ReviewStatus;
  reviewedAt: string | null;
  assessorName: string;
  scores: { total: number; project: number; interview: number };
  scale: ScoreScale;
  projectFindingCount: number;
  questions: ReviewQuestion[];
  markers: IntegrityMarker[];
  decisionReasons: string[];
  notes: string;
  videoUrl: string | null;
  durationSec: number | null;
};

/** Data yang dibutuhkan UI tetapi belum dikirim backend (lihat DESIGN_GUIDE.md). Sementara diisi mock. */
export type ReviewSupplement = {
  videoUrl?: string | null;
  durationSec?: number | null;
  eyeThresholds?: { efsPercent: number; edpPercent: number } | null;
  questions?: Record<number, QuestionSupplement>;
};

export type QuestionSupplement = {
  title?: string;
  prompt?: string;
  startSec?: number;
  endSec?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendation?: string;
  objectTimestamps?: Record<string, number>;
  eyeMomentsSec?: number[];
};

const OBJECT_LABELS: Record<string, string> = {
  "cell phone": "Ponsel",
  phone: "Ponsel",
  book: "Buku",
  laptop: "Laptop",
  tablet: "Tablet",
  person: "Orang lain",
  paper: "Kertas",
  headphones: "Headphone",
  earphone: "Earphone",
};

export function translateObjectLabel(raw: string) {
  const known = OBJECT_LABELS[raw.trim().toLowerCase()];
  if (known) return known;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/**
 * Backend belum mengirim transkrip bertimestamp. Sementara transkrip per pertanyaan dipecah per
 * kalimat dan waktunya dibagi rata sesuai panjang teks, supaya alur klik-timestamp bisa dipakai.
 */
function splitTranscript(
  questionId: number,
  transcript: string,
  startSec: number | null,
  endSec: number | null,
): TranscriptSegment[] {
  const sentences = transcript
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length === 0) return [];

  if (startSec === null || endSec === null || endSec <= startSec) {
    return sentences.map((text, i) => ({
      id: `${questionId}-${i}`,
      questionId,
      startSec: null,
      endSec: null,
      text,
    }));
  }

  const totalChars = sentences.reduce((sum, s) => sum + s.length, 0);
  const span = endSec - startSec;
  let cursor = startSec;
  return sentences.map((text, i) => {
    const length = (text.length / totalChars) * span;
    const segment = {
      id: `${questionId}-${i}`,
      questionId,
      startSec: Math.round(cursor),
      endSec: i === sentences.length - 1 ? endSec : Math.round(cursor + length),
      text,
    };
    cursor += length;
    return segment;
  });
}

function readAssessment(item: RawInterviewScore, extra: QuestionSupplement): AssessmentFeedback {
  const result: RawAssessmentResult = item.assessmentResult ?? item.assesmentResult ?? {};
  return {
    feedback: result.feedback ?? item.aiAssessment?.justification ?? "",
    strengths: result.strengths ?? extra.strengths ?? [],
    weaknesses: result.weaknesses ?? extra.weaknesses ?? [],
    recommendation: result.recommendation ?? extra.recommendation ?? null,
    rawScore: result.score ?? null,
  };
}

function readQuestion(
  item: RawInterviewScore,
  index: number,
  supplement: ReviewSupplement,
): ReviewQuestion {
  const extra = supplement.questions?.[item.id] ?? {};
  const signals: RawCheatingSignals = item.cheatingSignals ?? item.aiAssessment?.cheatingSignals ?? {};
  const speech = item.speechBehavior ?? item.aiAssessment?.speechBehavior ?? null;
  const startSec = extra.startSec ?? null;
  const endSec = extra.endSec ?? null;
  const transcript = item.transcript ?? "";

  const objects: DetectedObject[] = (signals.objectDetection?.suspiciousObject ?? []).map((key) => ({
    key,
    label: translateObjectLabel(key),
    timestampSec: extra.objectTimestamps?.[key] ?? null,
  }));

  const rawEye = signals.eyeTracking;
  const eyeNeedsReview = rawEye ? rawEye.status.trim().toLowerCase() !== "normal" : false;
  const eye: EyeSignal | null = rawEye
    ? {
        efsPercent: rawEye.efsPercent,
        edpPercent: rawEye.edpPercent,
        confidence: rawEye.confidence,
        needsReview: eyeNeedsReview,
        thresholds: {
          efsPercent: supplement.eyeThresholds?.efsPercent ?? null,
          edpPercent: supplement.eyeThresholds?.edpPercent ?? null,
        },
        momentsSec: eyeNeedsReview ? (extra.eyeMomentsSec ?? []) : [],
      }
    : null;

  return {
    id: item.id,
    index: index + 1,
    title: extra.title ?? null,
    prompt: extra.prompt ?? null,
    score: item.score,
    transcript,
    segments: splitTranscript(item.id, transcript, startSec, endSec),
    startSec,
    endSec,
    assessment: readAssessment(item, extra),
    objects,
    eye,
    speech,
    flagged: objects.length > 0 || Boolean(eye?.needsReview),
  };
}

function buildMarkers(questions: ReviewQuestion[]): IntegrityMarker[] {
  return questions.flatMap((q) => [
    ...q.objects
      .filter((o) => o.timestampSec !== null)
      .map((o) => ({
        id: `${q.id}-obj-${o.key}`,
        questionId: q.id,
        timestampSec: o.timestampSec as number,
        label: `${o.label} terdeteksi`,
      })),
    ...(q.eye?.momentsSec ?? []).map((sec, i) => ({
      id: `${q.id}-eye-${i}`,
      questionId: q.id,
      timestampSec: sec,
      label: "Pandangan sering keluar layar",
    })),
  ]);
}

/** Backend belum mengirim alasan `decision`; sementara diturunkan dari sinyal per pertanyaan. */
function deriveReasons(questions: ReviewQuestion[]) {
  return questions
    .filter((q) => q.flagged)
    .map((q) => {
      const parts: string[] = [];
      if (q.objects.length > 0) {
        parts.push(`terdeteksi ${q.objects.map((o) => o.label.toLowerCase()).join(" & ")}`);
      }
      if (q.eye?.needsReview) parts.push("pandangan mata perlu ditinjau");
      return `Q${q.index} ${parts.join(", ")}`;
    });
}

/** "2026-10-03 10:42:15" tanpa zona waktu dianggap WIB. Backend sebaiknya mengirim ISO 8601 + zona. */
function toIsoDate(value: string | undefined) {
  if (!value) return null;
  const hasZone = /([+-]\d{2}:?\d{2}|Z)$/.test(value);
  const iso = hasZone ? value : `${value.replace(" ", "T")}+07:00`;
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}

export function normalizeReview(raw: RawReviewResult, supplement: ReviewSupplement = {}): Review {
  const { interviews, project } = raw.reviewChecklistResult;
  const questions = interviews.scores.map((item, i) => readQuestion(item, i, supplement));

  return {
    decision: raw.decision,
    status: decisionToStatus(raw.decision),
    reviewedAt: toIsoDate(raw.reviewedAt),
    assessorName: raw.assessorProfile?.name ?? "Asesor AI",
    scores: raw.scoresOverview,
    scale: { min: interviews.minScore, max: interviews.maxScore },
    projectFindingCount: project?.length ?? 0,
    questions,
    markers: buildMarkers(questions),
    decisionReasons: deriveReasons(questions),
    notes: raw.notes ?? "",
    videoUrl: supplement.videoUrl ?? null,
    durationSec: supplement.durationSec ?? null,
  };
}
