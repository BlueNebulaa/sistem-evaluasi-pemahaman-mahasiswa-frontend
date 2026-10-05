// Tipe mengikuti struktur review_result.json dari backend.

export type ObjectDetection = {
  hasSuspiciousObject: boolean;
  suspiciousObject: string[];
};

export type EyeTracking = {
  efsPercent: number;
  edpPercent: number;
  confidence: number;
  status: string;
};

export type SpeechBehavior = {
  wordsPerMinute: number;
  tempo: string;
  totalSilenceSec: number;
  fillerWordCount: number;
};

export type InterviewScore = {
  id: number;
  score: number;
  transcript: string;
  aiAssessment: {
    justification: string;
    cheatingSignals: {
      objectDetection: ObjectDetection;
      eyeTracking: EyeTracking;
    };
    speechBehavior: SpeechBehavior;
  };
};

export type InterviewChecklist = {
  minScore: number;
  maxScore: number;
  scores: InterviewScore[];
};

export type ReviewResult = {
  assessorProfile: {
    id: number;
    name: string;
    photoUrl: string;
  };
  decision: string;
  reviewedAt: string;
  scoresOverview: {
    project: number;
    interview: number;
    total: number;
  };
  reviewChecklistResult: {
    project: unknown[];
    interviews: InterviewChecklist;
  };
  notes: string;
};

export const NEED_HUMAN_DECISION = "Need Human";

export function isEyeTrackingNormal(eyeTracking: EyeTracking) {
  return eyeTracking.status === "Normal";
}

/** Pertanyaan perlu dicek manual jika ada objek mencurigakan atau eye tracking tidak normal. */
export function isFlagged(item: InterviewScore) {
  const { objectDetection, eyeTracking } = item.aiAssessment.cheatingSignals;
  return objectDetection.hasSuspiciousObject || !isEyeTrackingNormal(eyeTracking);
}

export function averageScore(scores: InterviewScore[]) {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, item) => sum + item.score, 0) / scores.length;
}
