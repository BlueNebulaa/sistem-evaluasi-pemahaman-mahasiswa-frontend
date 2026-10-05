import type { ReviewResult } from "@/lib/review";
import { BotIcon, UserIcon } from "./icons";
import { DownloadJsonButton } from "./download-json-button";
import { Card } from "./ui";

const DECISION_STYLES: Record<string, string> = {
  "Need Human": "border-amber-300 bg-amber-50 text-amber-700",
};
const DEFAULT_DECISION_STYLE = "border-slate-300 bg-slate-50 text-slate-700";

type AssessorCardProps = {
  review: ReviewResult;
  subtitle: string;
  reviewerNotesHref: string;
};

export function AssessorCard({ review, subtitle, reviewerNotesHref }: AssessorCardProps) {
  const { assessorProfile, decision, reviewedAt } = review;

  return (
    <Card className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
      <AssessorAvatar name={assessorProfile.name} photoUrl={assessorProfile.photoUrl} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-900">{assessorProfile.name}</h2>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
            id {assessorProfile.id}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          Direview pada {reviewedAt} · {subtitle}
        </p>
      </div>

      <div
        className={`rounded-lg border px-3 py-1.5 ${DECISION_STYLES[decision] ?? DEFAULT_DECISION_STYLE}`}
      >
        <p className="text-[9px] font-semibold uppercase tracking-wider opacity-80">Keputusan</p>
        <p className="flex items-center gap-1 text-sm font-semibold">
          <UserIcon className="size-3.5" />
          {decision}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <a
          href={reviewerNotesHref}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Ambil alih review
        </a>
        <DownloadJsonButton data={review} fileName="review_result.json" />
      </div>
    </Card>
  );
}

function AssessorAvatar({ name, photoUrl }: { name: string; photoUrl: string }) {
  if (/^(https?:\/\/|\/)/.test(photoUrl)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- domain foto assessor belum diketahui untuk next/image
      <img src={photoUrl} alt={name} className="size-11 shrink-0 rounded-full object-cover" />
    );
  }
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-slate-900 text-white">
      <BotIcon className="size-5" />
    </span>
  );
}
