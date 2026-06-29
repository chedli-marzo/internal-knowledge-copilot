import { MessageSquare } from "lucide-react";

/** Shown in the chat panel before any messages exist. */
export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="bg-surface-secondary text-text-secondary flex size-12 items-center justify-center rounded-lg">
        <MessageSquare className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-foreground font-medium">
          Ask a question about your company documentation.
        </p>
        <p className="text-text-secondary max-w-sm text-sm">
          Answers are generated from your uploaded documents, with sources cited.
        </p>
      </div>
    </div>
  );
}
