"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { AlertCircle, Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { EmptyState } from "@/components/chat/empty-state";
import { ToolCall, isToolPart } from "@/components/chat/tool-call";

/** Concatenate the text parts of a UIMessage into a single string. */
function messageText(message: { parts: Array<{ type: string }> }): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/**
 * Main chat panel. Talks to the streaming route at /api/chat (the useChat
 * default endpoint). Shows empty / thinking / streaming / error states.
 */
export function Chat() {
  const { messages, sendMessage, status, error, stop, regenerate, clearError } =
    useChat();

  const isBusy = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  // Auto-scroll to the latest message as content streams in.
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
            {messages.map((message) => {
              const role = message.role as "user" | "assistant";
              const toolParts = message.parts.filter(isToolPart);
              const text = messageText(message);
              return (
                <div key={message.id} className="flex flex-col gap-2">
                  {/* Tool calls the assistant made, shown above its answer. */}
                  {toolParts.map((part, i) => (
                    <ToolCall key={i} part={part} />
                  ))}
                  {text && <MessageBubble role={role}>{text}</MessageBubble>}
                </div>
              );
            })}

            {/* Thinking indicator: request sent, no tokens yet. */}
            {status === "submitted" && (
              <div className="flex gap-3">
                <div className="bg-surface-secondary text-text-secondary flex size-8 shrink-0 items-center justify-center rounded-md">
                  <Bot className="size-4" />
                </div>
                <div className="bg-surface border-border flex items-center gap-1 rounded-lg border px-4 py-3">
                  <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
                </div>
              </div>
            )}

            {/* Inline error with retry. */}
            {error && (
              <div className="border-danger/30 bg-danger/5 text-danger flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm">
                <span className="flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  Something went wrong generating the answer.
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    clearError();
                    regenerate();
                  }}
                >
                  Retry
                </Button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput
        onSend={(text) => sendMessage({ text })}
        isStreaming={isBusy}
        onStop={stop}
      />
    </div>
  );
}

/** Single bouncing dot for the thinking indicator. */
function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="bg-text-muted size-1.5 animate-bounce rounded-full"
      style={{ animationDelay: delay }}
    />
  );
}
