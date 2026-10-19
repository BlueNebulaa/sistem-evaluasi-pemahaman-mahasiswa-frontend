import Link from "next/link";
import { STUDENT } from "@/lib/mock-data";
import { Avatar, Logo, MAIN_CONTENT_ID } from "@/app/_components/ui/brand";
import { ThemeToggle } from "@/app/_components/ui/theme-toggle";

// Alur mahasiswa: satu kolom terpusat, maks. 720px, mobile-first.
export default function StudentLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-180 items-center justify-between gap-4 px-4">
          <Link href="/asesmen" aria-label="Themis, ke daftar asesmen" className="rounded-md">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden text-body-sm font-medium text-fg sm:inline">{STUDENT.name}</span>
            <Avatar initials={STUDENT.initials} label={STUDENT.name} />
          </div>
        </div>
      </header>
      <main id={MAIN_CONTENT_ID} className="mx-auto w-full max-w-180 flex-1 px-4 pb-16 pt-8 sm:pt-12">
        {children}
      </main>
    </div>
  );
}
