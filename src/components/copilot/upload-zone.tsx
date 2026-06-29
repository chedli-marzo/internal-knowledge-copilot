"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; name: string }
  | { kind: "done"; name: string; chunks: number; pages: number }
  | { kind: "error"; message: string };

/** Upload a PDF to /api/ingest, with simple status feedback. */
export function UploadZone({ onIngested }: { onIngested?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleFile(file: File) {
    setStatus({ kind: "uploading", name: file.name });
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/ingest", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error ?? "Upload failed." });
        return;
      }
      setStatus({ kind: "done", name: data.source, chunks: data.chunks, pages: data.pages });
      onIngested?.();
    } catch {
      setStatus({ kind: "error", message: "Network error during upload." });
    }
  }

  return (
    <div className="border-border bg-surface rounded-lg border border-dashed p-4 text-center">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = ""; // allow re-uploading the same file
        }}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={status.kind === "uploading"}
      >
        {status.kind === "uploading" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {status.kind === "uploading" ? "Ingesting…" : "Upload a PDF"}
      </Button>

      <div className="text-text-secondary mt-2 text-xs">
        {status.kind === "idle" && "Add a PDF to the knowledge base."}
        {status.kind === "uploading" && `Reading ${status.name}…`}
        {status.kind === "done" && (
          <span className="text-success inline-flex items-center gap-1">
            <CheckCircle className="size-3.5" />
            {status.name}: {status.chunks} chunks from {status.pages} page(s)
          </span>
        )}
        {status.kind === "error" && (
          <span className="text-danger inline-flex items-center gap-1">
            <AlertCircle className="size-3.5" />
            {status.message}
          </span>
        )}
      </div>
    </div>
  );
}
