import { searchDocuments } from "@/lib/search";

/** POST { query } -> top-5 most semantically similar documents. */
export async function POST(req: Request) {
  try {
    const { query }: { query?: string } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return Response.json({ error: 'Please provide a non-empty "query".' }, { status: 400 });
    }

    const results = await searchDocuments(query, 5);
    return Response.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Search failed." }, { status: 500 });
  }
}
