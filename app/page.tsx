import { ArrowRight, GraduationCap, ClipboardCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Logo, MAIN_CONTENT_ID } from "./_components/ui/brand";
import { ThemeToggle } from "./_components/ui/theme-toggle";

function RoleCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-lg border border-line bg-surface p-6 shadow-xs transition-shadow duration-(--motion-fast) ease-standard hover:shadow-sm"
    >
      <span className="grid size-12 place-items-center rounded-md bg-primary-soft text-primary">
        <Icon aria-hidden className="size-6" />
      </span>
      <span className="mt-5 flex items-center gap-2 text-h3 text-fg">
        {title}
        <ArrowRight
          aria-hidden
          className="size-5 text-fg-muted transition-transform duration-(--motion-fast) ease-standard group-hover:translate-x-1 group-hover:text-primary"
        />
      </span>
      <span className="mt-1 text-body text-fg-muted">{description}</span>
    </Link>
  );
}

export default function EntryPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-180 flex-col px-4">
      <header className="flex h-16 items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>

      <main id={MAIN_CONTENT_ID} className="flex flex-1 flex-col justify-center py-12">
        <h1 className="max-w-[24ch] text-h1 text-fg">
          Asesmen lisan yang dinilai AI dan diputuskan dosen.
        </h1>
        <p className="mt-4 max-w-[60ch] text-body-lg text-fg-muted">
          Mahasiswa mengunggah video jawaban. AI menyiapkan skor beserta alasan dan buktinya, lalu
          dosen memeriksa dan menyetujui.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <RoleCard
            href="/asesmen"
            icon={GraduationCap}
            title="Saya mahasiswa"
            description="Kerjakan asesmen dan lihat masukan untukmu."
          />
          <RoleCard
            href="/dosen"
            icon={ClipboardCheck}
            title="Saya dosen"
            description="Tinjau penilaian AI dan setujui hasil."
          />
        </div>
      </main>

      <footer className="py-6 text-caption text-fg-muted">
        Prototipe dengan data contoh; belum terhubung ke backend.
      </footer>
    </div>
  );
}
