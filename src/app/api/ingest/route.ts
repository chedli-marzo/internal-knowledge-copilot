import { extractText } from "unpdf";

import { prisma } from "@/lib/db";
import { embedDocuments } from "@ikc/ai-core/embeddings";
import { chunkText } from "@/lib/chunk";

/**
 * Ingest a PDF (T1-5): extract text per page -> chunk -> embed -> store with
 * source + page so answers can be cited later.
 * Expects multipart/form-data with a `file` field.
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Upload a PDF in the 'file' field." }, { status: 400 });
    }

    // unpdf wants the raw bytes; text comes back as one string per page.
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { text: pages } = await extractText(bytes);

    // Chunk each page, keeping its page number for citations.
    const records: { content: string; page: number; chunkIndex: number }[] = [];
    let chunkIndex = 0;
    pages.forEach((pageText, pageIdx) => {
      for (const content of chunkText(pageText)) {
        records.push({ content, page: pageIdx + 1, chunkIndex: chunkIndex++ });
      }
    });

    if (records.length === 0) {
      return Response.json(
        { error: "No extractable text found (is this a scanned PDF?)." },
        { status: 400 },
      );
    }

    // Embed all chunks (embedMany batches internally), then insert via raw SQL
    // (the vector column is Unsupported in Prisma Client).
    const embeddings = await embedDocuments(records.map((r) => r.content));

    for (let i = 0; i < records.length; i++) {
      const vector = `[${embeddings[i].join(",")}]`;
      await prisma.$executeRaw`
        INSERT INTO "Document" (id, content, embedding, source, page, "chunkIndex")
        VALUES (gen_random_uuid(), ${records[i].content}, ${vector}::vector, ${file.name}, ${records[i].page}, ${records[i].chunkIndex})
      `;
    }

    return Response.json({
      source: file.name,
      pages: pages.length,
      chunks: records.length,
    });
  } catch (error) {
    console.error("Ingest error:", error);
    return Response.json({ error: "Failed to ingest the PDF." }, { status: 500 });
  }
}
