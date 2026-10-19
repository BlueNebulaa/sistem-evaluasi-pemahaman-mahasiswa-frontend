"use client";

import { CircleAlert, FileVideo, RotateCcw, Send, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/cn";
import { formatBytes, formatTimestamp } from "@/lib/format";
import { Button } from "../ui/button";

const ACCEPTED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const ACCEPTED_EXTENSIONS = [".mp4", ".mov", ".webm"];
const MAX_BYTES = 500 * 1024 * 1024;

type SelectedVideo = { file: File; url: string; durationSec: number };
type UploadState = { status: "idle" } | { status: "uploading"; progress: number } | { status: "failed" };

function hasAcceptedFormat(file: File) {
  const name = file.name.toLowerCase();
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function readDuration(url: string) {
  return new Promise<number>((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => resolve(video.duration);
    video.onerror = () => reject(new Error("unreadable"));
    video.src = url;
  });
}

/** Dropzone + pilih file, validasi format/ukuran/durasi di browser, pratinjau, dan progres unggah. */
export function UploadDropzone({ assessmentId, maxDurationMin }: { assessmentId: string; maxDurationMin: number }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [checking, setChecking] = useState(false);
  const [selected, setSelected] = useState<SelectedVideo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [upload, setUpload] = useState<UploadState>({ status: "idle" });
  const helpId = useId();
  const errorId = useId();

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
    },
    [],
  );

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUpload({ status: "idle" });

    if (!hasAcceptedFormat(file)) {
      setError("Format belum didukung. Gunakan video MP4, MOV, atau WebM.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `Ukuran video ${formatBytes(file.size)} melebihi batas 500 MB. Coba rekam ulang dengan resolusi 720p.`,
      );
      return;
    }

    const url = URL.createObjectURL(file);
    setChecking(true);
    try {
      const durationSec = await readDuration(url);
      if (durationSec > maxDurationMin * 60) {
        URL.revokeObjectURL(url);
        setError(
          `Durasi video ${formatTimestamp(durationSec)} melebihi batas ${maxDurationMin} menit. Coba rekam ulang dengan jawaban yang lebih ringkas.`,
        );
        return;
      }
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = url;
      setSelected({ file, url, durationSec });
    } catch {
      URL.revokeObjectURL(url);
      setError("Video tidak bisa dibaca. Pastikan file tidak rusak, lalu coba lagi.");
    } finally {
      setChecking(false);
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  }

  // Simulasi unggah sampai endpoint backend tersedia.
  function startUpload() {
    if (!navigator.onLine) {
      setUpload({ status: "failed" });
      return;
    }
    let progress = 0;
    setUpload({ status: "uploading", progress });
    timerRef.current = window.setInterval(() => {
      progress = Math.min(100, progress + 6 + Math.random() * 10);
      setUpload({ status: "uploading", progress });
      if (progress >= 100 && timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
        router.push(`/asesmen/${assessmentId}/status`);
      }
    }, 250);
  }

  const uploading = upload.status === "uploading";
  const describedBy = [helpId, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={[...ACCEPTED_TYPES, ...ACCEPTED_EXTENSIONS].join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {selected ? (
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
          <video src={selected.url} controls playsInline className="aspect-video w-full bg-video" />
          <div className="flex flex-wrap items-center gap-3 p-4">
            <FileVideo aria-hidden className="size-6 text-fg-muted" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body font-medium text-fg">{selected.file.name}</p>
              <p className="font-mono text-body-sm text-fg-muted">
                {formatBytes(selected.file.size)} · {formatTimestamp(selected.durationSec)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="lg"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <RotateCcw aria-hidden />
              Ganti video
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          data-dragging={dragging}
          className={cn(
            "flex flex-col items-center rounded-xl border-2 border-dashed border-line bg-surface px-6 py-12 text-center",
            "transition-colors duration-(--motion-fast) ease-standard data-[dragging=true]:border-primary data-[dragging=true]:bg-primary-soft",
          )}
        >
          <span className="grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
            <Upload aria-hidden className="size-6" />
          </span>
          <p className="mt-4 text-body-lg font-semibold text-fg">
            {checking ? "Memeriksa video…" : "Seret video ke sini"}
          </p>
          <p className="mt-1 text-body text-fg-muted">atau</p>
          <Button
            size="lg"
            className="mt-3"
            disabled={checking}
            aria-describedby={describedBy}
            onClick={() => inputRef.current?.click()}
          >
            Pilih file video
          </Button>
        </div>
      )}

      <p id={helpId} className="mt-3 text-body-sm text-fg-muted">
        MP4, MOV, atau WebM · maksimal 500 MB · maksimal {maxDurationMin} menit
      </p>

      {error && (
        <p id={errorId} role="alert" className="mt-3 flex items-start gap-2 text-body text-danger">
          <CircleAlert aria-hidden className="mt-0.5 size-5" />
          {error}
        </p>
      )}

      {upload.status === "failed" && (
        <p role="alert" className="mt-3 flex items-start gap-2 text-body text-danger">
          <CircleAlert aria-hidden className="mt-0.5 size-5" />
          Video belum berhasil diunggah. Coba lagi atau periksa koneksi.
        </p>
      )}

      {uploading && (
        <div className="mt-6">
          <div className="flex justify-between text-body-sm">
            <span className="font-medium text-fg">Mengunggah video…</span>
            <span className="font-mono tabular-nums text-fg-muted">{Math.round(upload.progress)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Progres unggah video"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(upload.progress)}
            className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted"
          >
            <div
              className="h-full origin-left bg-primary transition-transform duration-(--motion-base) ease-standard"
              style={{ transform: `scaleX(${upload.progress / 100})` }}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          disabled={!selected || uploading}
          onClick={startUpload}
        >
          <Send aria-hidden />
          {upload.status === "failed" ? "Coba kirim lagi" : "Kirim untuk dinilai"}
        </Button>
      </div>
    </div>
  );
}
