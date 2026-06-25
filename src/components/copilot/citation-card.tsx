import { FileText } from "lucide-react";

export type Citation = {
  ref: number;
  source: string | null;
  page: number | null;
  similarity: number;
};

/** Small card showing one source the answer drew from. */
export function CitationCard({ citation }: { citation: Citation }) {
  return (
    <div className="border-border bg-citation flex items-center gap-2 rounded-md border px-3 py-2 text-xs">
      <span className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold">
        {citation.ref}
      </span>
      <FileText className="text-text-secondary size-3.5 shrink-0" />
      <span className="text-foreground truncate font-medium">
        {citation.source ?? "Unknown source"}
        {citation.page ? <span className="text-text-secondary"> · p.{citation.page}</span> : null}
      </span>
      <span className="text-text-muted ml-auto shrink-0">
        {Math.round(citation.similarity * 100)}% match
      </span>
    </div>
  );
}
