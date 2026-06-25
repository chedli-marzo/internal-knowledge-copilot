import { Wrench, Check, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Minimal shape of a UIMessage tool part (v6).
 * type is `tool-<name>`; state moves input-available -> output-available/error.
 */
type ToolPart = {
  type: string;
  state?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

/** True for any `tool-*` message part. */
export function isToolPart(part: { type: string }): part is ToolPart {
  return part.type.startsWith("tool-");
}

/** Renders one tool call: which tool, the args it was called with, the result. */
export function ToolCall({ part }: { part: ToolPart }) {
  const name = part.type.replace(/^tool-/, "");
  const done = part.state === "output-available";
  const errored = part.state === "output-error";

  return (
    <div className="border-border bg-surface-secondary text-text-secondary rounded-md border px-3 py-2 text-xs">
      <div className="flex items-center gap-2 font-medium">
        <Wrench className="size-3.5" />
        <span className="text-foreground">{name}</span>
        {errored ? (
          <AlertCircle className="text-danger size-3.5" />
        ) : done ? (
          <Check className="text-success size-3.5" />
        ) : (
          <Loader2 className="size-3.5 animate-spin" />
        )}
      </div>

      {part.input != null && (
        <Row label="args" value={part.input} />
      )}
      {errored ? (
        <Row label="error" value={part.errorText} className="text-danger" />
      ) : (
        part.output != null && <Row label="result" value={part.output} />
      )}
    </div>
  );
}

function Row({
  label,
  value,
  className,
}: {
  label: string;
  value: unknown;
  className?: string;
}) {
  const text =
    typeof value === "string" ? value : JSON.stringify(value);
  return (
    <div className={cn("mt-1 flex gap-2", className)}>
      <span className="text-text-muted shrink-0">{label}:</span>
      <code className="break-all">{text}</code>
    </div>
  );
}
