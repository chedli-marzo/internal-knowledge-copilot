import { streamText, convertToModelMessages, type UIMessage } from "ai";

import { searchDocuments } from "@/lib/search";
import { getLanguageModel, isProviderId } from "@ikc/ai-core/chat";
import { buildRagContext, ragSystemPrompt } from "@ikc/ai-core/rag";

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
    const { messages, provider }: { messages: UIMessage[]; provider?: string } =
      await req.json();
    const query = lastUserText(messages);

    if (!query) {
      return Response.json({ error: "No question provided." }, { status: 400 });
    }

    // Retrieve the top chunks (app-specific Prisma search), then let the shared
    // RAG service turn them into a grounded prompt + citations.
    const hits = await searchDocuments(query, 5);
    const { context, citations } = buildRagContext(hits);

    const result = streamText({
      model: getLanguageModel(isProviderId(provider) ? provider : undefined),
      system: ragSystemPrompt(context),
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
