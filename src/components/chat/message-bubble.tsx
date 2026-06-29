import { Bot, User } from "lucide-react";

import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  role: "user" | "assistant";
  children: React.ReactNode;
};

/**
 * A single chat message. User messages sit right in the primary color;
 * assistant messages sit left on a neutral surface.
 */
export function MessageBubble({ role, children }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-surface-secondary text-text-secondary"
        )}
        aria-hidden
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-surface border-border text-foreground border"
        )}
      >
        {children}
      </div>
    </div>
  );
}
