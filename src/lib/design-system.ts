/**
 * Design system — semantic layer.
 *
 * Re-exports raw tokens and adds meaning on top: status -> color/label maps and
 * shared domain types used across chat, documents and citation components.
 * Import from here (not tokens.ts) when you need a *semantic* value.
 */

export * from "@/styles/tokens";

/** Document ingestion lifecycle shown in the sidebar. */
export type DocumentStatus = "uploading" | "processing" | "ready" | "error";

/** Tailwind classes per document status badge. */
export const documentStatusStyles: Record<
  DocumentStatus,
  { label: string; className: string }
> = {
  uploading: {
    label: "Uploading",
    className: "bg-surface-secondary text-text-secondary",
  },
  processing: {
    label: "Processing",
    className: "bg-warning/10 text-warning",
  },
  ready: {
    label: "Ready",
    className: "bg-success/10 text-success",
  },
  error: {
    label: "Failed",
    className: "bg-danger/10 text-danger",
  },
};

/** Where an error originated — drives ErrorState copy. */
export type ErrorVariant = "upload" | "retrieval" | "generation";

/** What is currently loading — drives LoadingState skeletons. */
export type LoadingVariant = "documents" | "chat" | "retrieval" | "streaming";

/** Fixed layout dimensions as Tailwind arbitrary-value helpers. */
export const layoutClasses = {
  header: "h-16", // 64px
  sidebar: "w-80", // 320px
  maxContent: "max-w-[1400px]",
} as const;
