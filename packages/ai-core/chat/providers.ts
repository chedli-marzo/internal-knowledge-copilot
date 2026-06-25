import type { LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { groq } from "@ai-sdk/groq";

/**
 * Provider abstraction — the shared interface for choosing which AI provider
 * answers. Callers use getLanguageModel(provider) and never import a provider
 * directly, so swapping providers is a one-call, runtime change.
 *
 * Chat/answer models only. Embeddings stay on Google (see ../embeddings) because
 * stored vectors have a fixed dimension.
 */

export type ProviderId = "google" | "groq" | "openai" | "anthropic";

export const PROVIDERS: ProviderId[] = ["google", "groq", "openai", "anthropic"];

/** Default provider when none is requested. Override with AI_PROVIDER in env. */
export const DEFAULT_PROVIDER: ProviderId = isProviderId(process.env.AI_PROVIDER)
  ? process.env.AI_PROVIDER
  : "google";

// Model ids per provider (overridable via env). Verify against each provider —
// ids change, and not every provider supports every feature.
const MODEL_IDS: Record<ProviderId, string> = {
  google: process.env.GOOGLE_MODEL ?? "gemini-2.5-flash",
  groq: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  openai: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
  anthropic: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
};

/** Human-friendly labels for a UI switch. */
export const PROVIDER_LABELS: Record<ProviderId, string> = {
  google: "Google Gemini",
  groq: "Groq (Llama)",
  openai: "OpenAI",
  anthropic: "Anthropic Claude",
};

/** The one function the rest of the app uses to get a chat model. */
export function getLanguageModel(
  provider: ProviderId = DEFAULT_PROVIDER,
): LanguageModel {
  switch (provider) {
    case "groq":
      return groq(MODEL_IDS.groq);
    case "openai":
      return openai(MODEL_IDS.openai);
    case "anthropic":
      return anthropic(MODEL_IDS.anthropic);
    case "google":
    default:
      return google(MODEL_IDS.google);
  }
}

/** Type guard for an incoming provider value (e.g. from a request body). */
export function isProviderId(value: unknown): value is ProviderId {
  return typeof value === "string" && (PROVIDERS as string[]).includes(value);
}
