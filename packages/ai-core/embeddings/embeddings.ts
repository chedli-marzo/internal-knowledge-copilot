import { embed, embedMany } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Shared embedding service. Turns text into vectors for semantic search.
 *
 * Fixed to Google at 768 dims so it matches a `vector(768)` column. Embeddings
 * are intentionally NOT provider-switchable — changing the model changes the
 * vector size and breaks any vectors already stored.
 *
 * taskType tunes the vector for its job: RETRIEVAL_DOCUMENT for stored text,
 * RETRIEVAL_QUERY for the user's question.
 */

export const EMBEDDING_DIMENSIONS = 768;
const model = google.textEmbedding("gemini-embedding-001");

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
