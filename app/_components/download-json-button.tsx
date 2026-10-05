"use client";

type DownloadJsonButtonProps = {
  data: unknown;
  fileName: string;
};

export function DownloadJsonButton({ data, fileName }: DownloadJsonButtonProps) {
  function download() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-50"
    >
      Unduh JSON
    </button>
  );
}
