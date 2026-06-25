import { z } from "zod";

/**
 * Schema for structured extraction from a piece of text (T1-2).
 *
 * Used in two ways:
 *  1. Passed to the AI SDK's generateObject() so the model MUST return JSON
 *     in exactly this shape.
 *  2. Validates that returned JSON before we trust it.
 *
 * The .describe() text is sent to the model as guidance — keep it meaningful.
 * Enums (fixed value lists) stop the model from inventing its own categories.
 */
export const extractionSchema = z.object({
  sentiment: z
    .enum(["negative", "neutral", "positive"])
    .describe("Overall emotional tone of the message."),
  priority: z
    .enum(["low", "medium", "high"])
    .describe("How urgently this needs a human response."),
  topic: z
    .enum(["shipping", "billing", "product", "account", "other"])
    .describe("The main subject the message is about."),
  summary: z
    .string()
    .describe("One short sentence summarizing the message."),
});

/** The validated result type, inferred from the schema (single source of truth). */
export type Extraction = z.infer<typeof extractionSchema>;
