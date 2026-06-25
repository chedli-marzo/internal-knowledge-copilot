import type { LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { groq } from "@ai-sdk/groq";

/**
 * Provider abstraction (T1-6).
 *
 * A single shared interface for choosing which AI provider answers. The rest of
 * the app calls getLanguageModel(provider) and never imports a provider directly,
 * so swapping providers is a one-call change and we can switch at RUNTIME.
 *
 * NOTE: this is for the CHAT/answer model only. Embeddings stay on Google
 * (see embeddings.ts) because the database stores 768-dim Gemini vectors —
 * changing the embedding provider would change the dimensions and break search.
 */

export type ProviderId = "google" | "groq" | "openai" | "anthropic";

export const PROVIDERS: ProviderId[] = ["google", "groq", "openai", "anthropic"];

/** Default provider when none is requested. Override with AI_PROVIDER in .env. */
export const DEFAULT_PROVIDER: ProviderId = isProviderId(process.env.AI_PROVIDER)
  ? process.env.AI_PROVIDER
  : "google";

// Model ids per provider (overridable via env). Verify against each provider
// before relying on it — ids change. Only Google has working credits here.
const MODEL_IDS: Record<ProviderId, string> = {
  google: process.env.GOOGLE_MODEL ?? "gemini-2.5-flash",
  groq: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  openai: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
  anthropic: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
};

/** Human-friendly labels for the UI switch. */
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
