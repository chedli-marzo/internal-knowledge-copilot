import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';

import { extractionSchema } from '@/lib/schemas/extraction';

export async function POST(req: Request) {
  try {
    const { text }: { text?: string } = await req.json();

    // Validate input before spending an AI call.
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return Response.json(
        { error: 'Please provide non-empty "text".' },
        { status: 400 },
      );
    }

    // Output.object forces the model to return JSON matching extractionSchema,
    // then validates it against the schema (throws on mismatch).
    const { output } = await generateText({
      model: google('gemini-2.5-flash'),
      output: Output.object({
        schema: extractionSchema,
        name: 'extraction',
        description: 'Structured classification of a customer message.',
      }),
      system:
        'You extract structured data from a customer message. ' +
        'Choose the closest allowed value for each field. Keep the summary to one short sentence.',
      prompt: text,
    });

    return Response.json(output);
  } catch (error) {
    // Covers bad JSON body, model failure, and schema-validation mismatch.
    console.error('Extract route error:', error);
    return Response.json(
      { error: 'Failed to extract structured data from the text.' },
      { status: 500 },
    );
  }
}
