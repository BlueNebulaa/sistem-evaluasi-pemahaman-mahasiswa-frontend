// Semua format tanggal dan angka memakai locale id-ID. Zona waktu dikunci ke WIB agar
// hasil render server dan browser sama.
const TIME_ZONE = "Asia/Jakarta";

const dateTimeFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

/** "3 Okt 2026, 10.42" */
export function formatDateTime(iso: string) {
  return dateTimeFormat.format(new Date(iso));
}

/** "22 Oktober 2026" */
export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso));
}

export function formatNumber(value: number, fractionDigits = 0) {
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Timestamp video: "04:47" atau "1:02:03". */
export function formatTimestamp(totalSec: number) {
  const s = Math.max(0, Math.floor(totalSec));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/** Versi lisan timestamp untuk pembaca layar: "4 menit 47 detik". */
export function formatSpokenTime(totalSec: number) {
  const s = Math.max(0, Math.floor(totalSec));
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  if (minutes === 0) return `${seconds} detik`;
  return seconds === 0 ? `${minutes} menit` : `${minutes} menit ${seconds} detik`;
}

export function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${formatNumber(mb / 1024, 1)} GB`;
  if (mb >= 1) return `${formatNumber(mb, mb >= 10 ? 0 : 1)} MB`;
  return `${formatNumber(bytes / 1024, 0)} KB`;
}
