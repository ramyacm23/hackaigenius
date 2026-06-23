"use client";

import { api } from "@/lib/api";

export function ExportPdfButton({ id }: { id: string }) {
  return (
    <a
      href={api.pdfUrl(id)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-brand px-4 py-2 text-sm font-medium text-brand transition hover:bg-brand hover:text-white"
    >
      ⬇ Export PDF
    </a>
  );
}
