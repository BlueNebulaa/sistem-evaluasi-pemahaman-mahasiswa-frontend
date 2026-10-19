import { SearchX } from "lucide-react";
import { MAIN_CONTENT_ID } from "./_components/ui/brand";
import { ButtonLink } from "./_components/ui/button";
import { EmptyState } from "./_components/ui/feedback";

export default function NotFound() {
  return (
    <main id={MAIN_CONTENT_ID} className="grid min-h-dvh place-items-center px-4">
      <EmptyState
        icon={SearchX}
        title="Halaman ini tidak ditemukan."
        description="Tautannya mungkin sudah berubah atau asesmen tersebut tidak lagi tersedia."
        action={
          <ButtonLink href="/" variant="primary">
            Kembali ke beranda
          </ButtonLink>
        }
      />
    </main>
  );
}
