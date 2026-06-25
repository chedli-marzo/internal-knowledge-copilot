import { prisma } from "@/lib/db";
import { embedQuery } from "@/lib/embeddings";

export type SearchHit = {
  id: string;
  content: string;
  source: string | null;
  page: number | null;
  similarity: number;
};

/**
 * Semantic search: embed the query, then find the closest stored documents.
 *
 * `<=>` is pgvector's cosine DISTANCE (smaller = closer). We order ascending to
 * get the most similar first, and report similarity as `1 - distance` so higher
 * means more relevant. Uses raw SQL because the embedding column is Unsupported
 * in Prisma Client.
 */
export async function searchDocuments(
  query: string,
  limit = 5,
): Promise<SearchHit[]> {
  const embedding = await embedQuery(query);
  const vector = `[${embedding.join(",")}]`;

  return prisma.$queryRaw<SearchHit[]>`
    SELECT id, content, source, page, 1 - (embedding <=> ${vector}::vector) AS similarity
    FROM "Document"
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${limit}
  `;
}
