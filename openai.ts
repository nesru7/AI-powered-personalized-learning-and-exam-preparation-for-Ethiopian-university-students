/**
 * lib/openai.ts
 *
 * Pre-configured OpenAI client. All AI calls in the application must go
 * through this module so the API key and defaults are centralised.
 */
import OpenAI from 'openai';

let client: OpenAI | undefined;

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required to use AI features.');
  }
  client ??= new OpenAI({ apiKey });
  return client;
}

/**
 * Sends a chat completion request and returns the first choice content string.
 *
 * @param messages  Array of chat messages following the OpenAI format
 * @param model     Model to use (default: gpt-4o)
 * @param temperature  Sampling temperature 0–2 (default: 0.7)
 * @returns         Text content of the first completion choice
 */
export async function generateCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  model: string = 'gpt-4o',
  temperature: number = 0.7,
): Promise<string> {
  const response = await getClient().chat.completions.create({
    model,
    messages,
    temperature,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned an empty completion.');
  }
  return content;
}
