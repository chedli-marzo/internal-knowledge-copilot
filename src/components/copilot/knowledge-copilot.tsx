"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AlertCircle, Bot, BookOpen } from "lucide-react";

import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { ProviderSelect } from "@/components/chat/provider-select";
import { UploadZone } from "@/components/copilot/upload-zone";
import { CitationCard, type Citation } from "@/components/copilot/citation-card";
import { DEFAULT_PROVIDER, type ProviderId } from "@/lib/ai/providers";

function messageText(message: { parts: Array<{ type: string }> }): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/** Citations the answer drew from (with a real source), from message metadata. */
function citationsOf(message: { metadata?: unknown }): Citation[] {
  const meta = message.metadata as { citations?: Citation[] } | undefined;
  return (meta?.citations ?? []).filter((c) => c.source);
}

/**
 * Knowledge Copilot (T1-5): upload PDFs, then ask questions. Answers come from
 * /api/rag — grounded in retrieved chunks and shown with citation cards.
 */
export function KnowledgeCopilot() {
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/rag" }),
  });
  const [provider, setProvider] = useState<ProviderId>(DEFAULT_PROVIDER);

  const isBusy = status === "submitted" || status === "streaming";
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
          <UploadZone />

          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <div className="bg-surface-secondary text-text-secondary flex size-12 items-center justify-center rounded-lg">
                <BookOpen className="size-6" />
              </div>
              <p className="text-foreground font-medium">
                Ask a question about your documents.
              </p>
              <p className="text-text-secondary max-w-sm text-sm">
                Upload a PDF above, then ask — answers are grounded in your files and cited.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const role = message.role as "user" | "assistant";
              const text = messageText(message);
              const citations = role === "assistant" ? citationsOf(message) : [];
              return (
                <div key={message.id} className="flex flex-col gap-2">
                  {text && <MessageBubble role={role}>{text}</MessageBubble>}
                  {citations.length > 0 && (
                    <div className="ml-11 flex flex-col gap-1.5">
                      <p className="text-text-muted text-xs font-medium uppercase">Sources</p>
                      {citations.map((c) => (
                        <CitationCard key={c.ref} citation={c} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {status === "submitted" && (
            <div className="flex gap-3">
              <div className="bg-surface-secondary text-text-secondary flex size-8 shrink-0 items-center justify-center rounded-md">
                <Bot className="size-4" />
              </div>
              <div className="bg-surface border-border rounded-lg border px-4 py-3 text-sm">
                Searching your documents…
              </div>
            </div>
          )}

          {error && (
            <div className="border-danger/30 bg-danger/5 text-danger flex items-center gap-2 rounded-lg border px-4 py-3 text-sm">
              <AlertCircle className="size-4" />
              Something went wrong. Please try again.
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-border bg-background flex items-center justify-end border-t px-4 pt-2">
        <ProviderSelect value={provider} onChange={setProvider} />
      </div>

      <ChatInput
        onSend={(text) => sendMessage({ text }, { body: { provider } })}
        isStreaming={isBusy}
        onStop={stop}
      />
    </div>
  );
}
