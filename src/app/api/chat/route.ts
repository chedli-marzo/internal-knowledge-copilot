import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages || messages.length === 0) {
      return Response.json({ error: 'No messages provided.' }, { status: 400 });
    }

    const result = streamText({
      // Google Gemini (free tier, no card). Uses GOOGLE_GENERATIVE_AI_API_KEY
      // from .env automatically.
      model: google('gemini-2.5-flash'),
      messages: await convertToModelMessages(messages),
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