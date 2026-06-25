/**
 * Split long text into overlapping chunks (T1-5).
 *
 * Why chunk: retrieval works best on small passages. A whole page is too coarse
 * (the relevant sentence gets drowned out); tiny fragments lose context. ~1000
 * chars with a little overlap keeps each chunk self-contained without cutting
 * ideas in half across the boundary.
 */
export function chunkText(text: string, chunkSize = 1000, overlap = 150): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const chunks: string[] = [];
  let start = 0;

  while (start < clean.length) {
    let end = Math.min(start + chunkSize, clean.length);

    // Prefer to break at a space near the end so we don't split a word.
    if (end < clean.length) {
      const lastSpace = clean.lastIndexOf(" ", end);
      if (lastSpace > start + chunkSize * 0.5) end = lastSpace;
    }

    const piece = clean.slice(start, end).trim();
    if (piece) chunks.push(piece);

    if (end >= clean.length) break;
    start = Math.max(0, end - overlap); // overlap so context carries across the cut
  }

  return chunks;
}
