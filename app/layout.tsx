import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PahamIn — Analisis Pemahaman Mahasiswa",
  description:
    "Analisis ujian lisan berbasis AI: transkripsi, penilaian pemahaman, analisis non-verbal, dan deteksi kecurangan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${jakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#eef1f8] font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
