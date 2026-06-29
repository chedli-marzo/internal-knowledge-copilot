import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai';

import { businessTools } from '@/lib/tools/business-tools';
import { getLanguageModel, isProviderId } from '@ikc/ai-core/chat';

export async function POST(req: Request) {
  try {
    const { messages, provider }: { messages: UIMessage[]; provider?: string } =
      await req.json();

    if (!messages || messages.length === 0) {
      return Response.json({ error: 'No messages provided.' }, { status: 400 });
    }

    const result = streamText({
      // Runtime provider switch: use the requested provider if valid, else the
      // env default. Provider-agnostic — see lib/ai/providers.ts.
      model: getLanguageModel(isProviderId(provider) ? provider : undefined),
      system:
        'You are an operations assistant. Use the available tools to look up ' +
        'orders, customers, and suppliers when the user asks about them. ' +
        'After a tool returns, answer the user in plain language using the result.',
      messages: await convertToModelMessages(messages),
      tools: businessTools,
      // Allow follow-up steps so the model can answer AFTER a tool runs.
      // (Default stepCountIs(1) would stop right after the tool call.)
      stopWhen: stepCountIs(5),
    });

    // Errors thrown DURING streaming land here. Return a safe message to the
    // client (the SDK hides raw errors as "An error occurred" by default).
    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error('Streaming error:', error);
        return 'Something went wrong while generating the answer. Please try again.';
      },
    });
  } catch (error) {
    // Errors BEFORE streaming starts (bad JSON, missing API key, etc.) land here.
    console.error('Chat route error:', error);
    return Response.json(
      { error: 'Failed to process the request.' },
      { status: 500 },
    );
  }
}