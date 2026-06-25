import { embed, embedMany } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Embedding helpers (T1-4).
 *
 * An embedding turns text into a list of numbers (a vector) capturing its
 * meaning. We use Gemini's embedding model at 768 dimensions to match the
 * `vector(768)` column in the schema.
 *
 * taskType tunes the vector for its job: RETRIEVAL_DOCUMENT for stored text,
 * RETRIEVAL_QUERY for the user's question. Matching them improves search quality.
 */

export const EMBEDDING_DIMENSIONS = 768;
const model = google.textEmbedding("gemini-embedding-001");

// Per-call provider options: request 768 dims + the right retrieval taskType.
const docOptions = {
  google: { outputDimensionality: EMBEDDING_DIMENSIONS, taskType: "RETRIEVAL_DOCUMENT" },
};
const queryOptions = {
  google: { outputDimensionality: EMBEDDING_DIMENSIONS, taskType: "RETRIEVAL_QUERY" },
};

/** Embed many documents at once (for ingestion/seeding). */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model,
    values: texts,
    providerOptions: docOptions,
  });
  return embeddings;
}

/** Embed a single search query. */
export async function embedQuery(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model,
    value: text,
    providerOptions: queryOptions,
  });
  return embedding;
}
