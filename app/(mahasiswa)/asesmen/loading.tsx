import { Card } from "@/app/_components/ui/card";
import { Skeleton } from "@/app/_components/ui/feedback";

export default function Loading() {
  return (
    <div role="status" aria-label="Memuat asesmen">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-3 h-6 w-full max-w-md" />
      <div className="mt-10 space-y-4">
        {[0, 1].map((i) => (
          <Card key={i} density="student" className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full max-w-sm" />
            <Skeleton className="h-12 w-40 rounded-md" />
          </Card>
        ))}
      </div>
    </div>
  );
}
