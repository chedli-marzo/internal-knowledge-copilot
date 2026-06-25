import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { google } from "@ai-sdk/google";

import { searchDocuments } from "@/lib/search";

/** Pull the plain text out of the latest user message (used as the search query). */
function lastUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "";
  return lastUser.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ");
}

/**
 * RAG answer route (T1-5): retrieve the most relevant chunks, ground the model
 * in them, stream the answer, and attach citations (source + page) as message
 * metadata so the UI can show where the answer came from.
 */
export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const query = lastUserText(messages);

    if (!query) {
      return Response.json({ error: "No question provided." }, { status: 400 });
    }

    // Retrieve the top chunks for this question.
    const hits = await searchDocuments(query, 5);

    // Build a numbered context block + the matching citation list.
    const context = hits
      .map((h, i) => `[${i + 1}] (${h.source ?? "unknown"}${h.page ? `, p.${h.page}` : ""})\n${h.content}`)
      .join("\n\n");

    const citations = hits.map((h, i) => ({
      ref: i + 1,
      source: h.source,
      page: h.page,
      similarity: Number(h.similarity.toFixed(3)),
    }));

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system:
        "You are a knowledge assistant. Answer the user's question using ONLY the " +
        "context below. Cite the sources you use with their bracket number, e.g. [1]. " +
        "If the answer is not in the context, say you don't know — do not make anything up.\n\n" +
        `Context:\n${context}`,
      messages: await convertToModelMessages(messages),
    });

    // Send citations to the client as metadata on the finish event.
    return result.toUIMessageStreamResponse({
      messageMetadata: ({ part }) =>
        part.type === "finish" ? { citations } : undefined,
      onError: (error) => {
        console.error("RAG streaming error:", error);
        return "Something went wrong generating the answer. Please try again.";
      },
    });
  } catch (error) {
    console.error("RAG route error:", error);
    return Response.json({ error: "Failed to answer the question." }, { status: 500 });
  }
}
