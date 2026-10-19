// Tipe mentah mengikuti struktur review_result.json dari backend.
// Field opsional disiapkan untuk bentuk yang disebut di DESIGN_GUIDE.md (assessmentResult, dsb.).
// Komponen tidak membaca tipe ini langsung; semuanya lewat normalizeReview() di lib/normalize-review.ts.

export type RawObjectDetection = {
  hasSuspiciousObject: boolean;
  suspiciousObject: string[];
};

export type RawEyeTracking = {
  efsPercent: number;
  edpPercent: number;
  confidence: number;
  status: string;
};

export type RawSpeechBehavior = {
  wordsPerMinute: number;
  tempo: string;
  totalSilenceSec: number;
  fillerWordCount: number;
};

export type RawCheatingSignals = {
  objectDetection?: RawObjectDetection;
  eyeTracking?: RawEyeTracking;
};

export type RawAssessmentResult = {
  feedback?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendation?: string;
  score?: number;
};

export type RawInterviewScore = {
  id: number;
  score: number;
  transcript?: string;
  aiAssessment?: {
    justification?: string;
    cheatingSignals?: RawCheatingSignals;
    speechBehavior?: RawSpeechBehavior;
  };
  assessmentResult?: RawAssessmentResult;
  /** Ejaan lama dari backend; dibaca sebagai assessmentResult. */
  assesmentResult?: RawAssessmentResult;
  cheatingSignals?: RawCheatingSignals;
  speechBehavior?: RawSpeechBehavior;
};

export type RawReviewResult = {
  assessorProfile?: {
    id: number;
    name: string;
    photoUrl?: string;
  };
  decision: string;
  reviewedAt?: string;
  scoresOverview: {
    project: number;
    interview: number;
    total: number;
  };
  reviewChecklistResult: {
    project?: unknown[];
    interviews: {
      minScore: number;
      maxScore: number;
      scores: RawInterviewScore[];
    };
  };
  notes?: string;
};
