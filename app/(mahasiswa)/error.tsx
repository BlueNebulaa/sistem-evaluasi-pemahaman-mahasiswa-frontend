"use client";

import { CloudOff } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { EmptyState } from "@/app/_components/ui/feedback";

export default function StudentError({
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
      title="Halaman ini belum bisa dimuat."
      description="Coba lagi sebentar lagi atau periksa koneksi internetmu."
      action={
        <Button variant="primary" size="lg" onClick={() => retry()}>
          Coba lagi
        </Button>
      }
    />
  );
}
