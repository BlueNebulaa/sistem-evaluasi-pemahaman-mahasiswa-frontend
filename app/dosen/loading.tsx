import { Card } from "@/app/_components/ui/card";
import { Skeleton } from "@/app/_components/ui/feedback";

export default function Loading() {
  return (
    <div role="status" aria-label="Memuat data" className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-2 h-9 w-64" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-16" />
          </Card>
        ))}
      </div>
      <Card density="none" className="mt-8 divide-y divide-line">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex h-12 items-center gap-6 px-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="ml-auto h-6 w-36 rounded-full" />
          </div>
        ))}
      </Card>
    </div>
  );
}
