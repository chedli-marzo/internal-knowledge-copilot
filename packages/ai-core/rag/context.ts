/**
 * Reusable RAG orchestration (provider- and database-agnostic).
 *
 * The actual retrieval (vector search) is injected by the caller as an array of
 * RetrievedChunk — this package doesn't know or care which database produced it.
 * Here we turn those chunks into a grounded prompt + citation list.
 */

/** A chunk returned by whatever retriever the app uses (e.g. a pgvector search). */
export type RetrievedChunk = {
  content: string;
  source?: string | null;
  page?: number | null;
  similarity?: number | null;
};

/** A source the answer can cite, shown in the UI. */
export type Citation = {
  ref: number;
  source: string | null;
  page: number | null;
  similarity: number;
};

/** Build a numbered context block + matching citations from retrieved chunks. */
export function buildRagContext(hits: RetrievedChunk[]): {
  context: string;
  citations: Citation[];
} {
  const context = hits
    .map(
      (h, i) =>
        `[${i + 1}] (${h.source ?? "unknown"}${h.page ? `, p.${h.page}` : ""})\n${h.content}`,
    )
    .join("\n\n");

  const citations: Citation[] = hits.map((h, i) => ({
    ref: i + 1,
    source: h.source ?? null,
    page: h.page ?? null,
    similarity: Number((h.similarity ?? 0).toFixed(3)),
  }));

  return { context, citations };
}

/** The grounding system prompt: answer only from context, cite, or say don't know. */
export function ragSystemPrompt(context: string): string {
  return (
    "You are a knowledge assistant. Answer the user's question using ONLY the " +
    "context below. Cite the sources you use with their bracket number, e.g. [1]. " +
    "If the answer is not in the context, say you don't know — do not make anything up.\n\n" +
    `Context:\n${context}`
  );
}
