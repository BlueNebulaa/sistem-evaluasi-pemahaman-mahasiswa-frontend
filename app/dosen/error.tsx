"use client";

import { CloudOff } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { EmptyState } from "@/app/_components/ui/feedback";

export default function LecturerError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      icon={CloudOff}
      title="Data belum bisa dimuat."
      description="Server tidak merespons. Coba lagi beberapa saat lagi."
      action={
        <Button variant="primary" onClick={() => retry()}>
          Coba lagi
        </Button>
      }
      className="py-24"
    />
  );
}
