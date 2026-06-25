import { prisma } from "@/lib/db";
import { embedDocuments } from "@/lib/embeddings";

// Sample company-knowledge snippets to embed and store (stand-in for real docs).
const SAMPLE_DOCS = [
  "Orders are shipped within 2 business days. Delayed orders are flagged in the dashboard.",
  "Refunds are processed to the original payment method within 5 to 7 business days.",
  "Supplier SteelWorks GmbH has a lead time of 14 days for raw steel.",
  "Supplier FastParts Co delivers small components in 5 days.",
  "Enterprise customers get priority support and a dedicated account manager.",
  "Inventory is counted on the last Friday of every month.",
  "Damaged goods must be reported within 48 hours of delivery to qualify for replacement.",
  "The warehouse operates Monday to Friday, 7am to 6pm.",
];

/** Seed the documents table: embed the samples and insert them (idempotent — clears first). */
export async function POST() {
  try {
    const embeddings = await embedDocuments(SAMPLE_DOCS);

    // Start clean so re-seeding doesn't pile up duplicates.
    await prisma.$executeRaw`TRUNCATE TABLE "Document"`;

    for (let i = 0; i < SAMPLE_DOCS.length; i++) {
      const vector = `[${embeddings[i].join(",")}]`;
      await prisma.$executeRaw`
        INSERT INTO "Document" (id, content, embedding)
        VALUES (gen_random_uuid(), ${SAMPLE_DOCS[i]}, ${vector}::vector)
      `;
    }

    const seeded = await prisma.document.count();
    return Response.json({ seeded });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error: "Failed to seed documents." }, { status: 500 });
  }
}
