"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
  /** Called with the trimmed text when the user submits. */
  onSend: (text: string) => void;
  /** True while a response is streaming — shows the stop button. */
  isStreaming?: boolean;
  /** Aborts the in-flight response. */
  onStop?: () => void;
  disabled?: boolean;
};

const MAX_HEIGHT = 200; // px — textarea stops growing, then scrolls.

/**
 * Fixed chat input. Auto-resizes to content, submits on Enter, inserts a
 * newline on Shift+Enter.
 */
export function ChatInput({
  onSend,
  isStreaming = false,
  onStop,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  // Grow the textarea with its content, up to MAX_HEIGHT.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || disabled || isStreaming) return;
    onSend(text);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-border bg-background border-t p-4">
      <div className="border-border bg-surface focus-within:ring-ring/50 focus-within:border-ring mx-auto flex max-w-3xl items-end gap-2 rounded-lg border p-2 transition-[box-shadow] focus-within:ring-[3px]">
        <Textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documentation…"
          disabled={disabled}
          aria-label="Chat message"
          className="max-h-[200px] min-h-0 resize-none border-0 bg-transparent p-1.5 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />

        {isStreaming ? (
          <Button
            size="icon"
            variant="secondary"
            onClick={onStop}
            aria-label="Stop generating"
          >
            <Square className="size-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={submit}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
          >
            <ArrowUp className="size-4" />
          </Button>
        )}
      </div>
      <p className="text-text-muted mx-auto mt-2 max-w-3xl text-center text-xs">
        Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}
