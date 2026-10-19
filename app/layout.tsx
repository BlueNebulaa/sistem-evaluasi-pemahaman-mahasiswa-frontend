import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { SkipLink } from "./_components/ui/brand";
import { ToastProvider } from "./_components/ui/toast";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Untuk timestamp, angka metrik, dan ID.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Themis · Asesmen Lisan Berbasis AI",
    template: "%s · Themis",
  },
  description:
    "Asesmen pemahaman mahasiswa dari video wawancara: dinilai AI dengan alasan yang bisa diperiksa, diputuskan dosen.",
  // Alat internal kampus; tidak untuk diindeks mesin pencari.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#151412" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      // data-theme diisi skrip tema sebelum hidrasi; perbedaan atribut ini disengaja.
      suppressHydrationWarning
      className={`${jakartaSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-canvas font-sans text-body text-fg">
        <SkipLink />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
