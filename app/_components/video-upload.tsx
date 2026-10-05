"use client";

import { useRef, useState, type DragEvent } from "react";
import { CheckIcon, PlayIcon, UploadIcon, VideoIcon } from "./icons";
import { Pill } from "./ui";

const ACCEPTED_MIME_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const ACCEPTED_EXTENSIONS = /\.(mp4|mov|webm)$/i;
const MAX_SIZE_BYTES = 500 * 1024 * 1024;

export type UploadedVideo = {
  fileName: string;
  meta: string;
  status: "analyzed" | "pending";
};

export function VideoUpload({ initialVideo }: { initialVideo: UploadedVideo | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [video, setVideo] = useState(initialVideo);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED_MIME_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.test(file.name)) {
      setError("Format tidak didukung. Gunakan MP4, MOV, atau WEBM.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Ukuran video melebihi batas 500 MB.");
      return;
    }

    setError(null);
    const duration = await readDurationLabel(file);
    setVideo({
      fileName: file.name,
      meta: [duration, formatFileSize(file.size)].filter(Boolean).join(" · "),
      status: "pending",
    });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  const openFilePicker = () => inputRef.current?.click();

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging ? "border-indigo-600 bg-indigo-50/70" : "border-indigo-500/80 bg-white"
        }`}
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
          <VideoIcon className="size-6" />
        </span>
        <p className="mt-5 text-lg font-semibold text-slate-900">Seret &amp; lepas video di sini</p>
        <p className="mt-1 text-xs text-slate-500">
          MP4, MOV, atau WEBM · maks. 500 MB · durasi ideal 5–20 menit
        </p>
        <button
          type="button"
          onClick={openFilePicker}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <UploadIcon className="size-4" />
          Upload Video
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        {error && (
          <p role="alert" className="mt-3 text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>

      {video && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <span className="grid h-9 w-12 shrink-0 place-items-center rounded-md bg-slate-900 text-white">
            <PlayIcon className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{video.fileName}</p>
            <p className="truncate text-[11px] text-slate-500">{video.meta}</p>
          </div>
          {video.status === "analyzed" ? (
            <Pill tone="success">
              <CheckIcon className="size-3" />
              Analisis selesai
            </Pill>
          ) : (
            <Pill tone="warning">Menunggu analisis</Pill>
          )}
          <button
            type="button"
            onClick={openFilePicker}
            className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            Ganti video
          </button>
        </div>
      )}
    </div>
  );
}

function readDurationLabel(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const element = document.createElement("video");
    element.preload = "metadata";
    element.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(formatDuration(element.duration));
    };
    element.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    element.src = url;
  });
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) return null;
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")} menit`;
}

function formatFileSize(bytes: number) {
  const megabytes = bytes / (1024 * 1024);
  return megabytes >= 1 ? `${Math.round(megabytes)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
