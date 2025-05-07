//import { openai } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export async function POST(req: Request) {
  //extract messages from post request
  const { messages } = await req.json();

  //streamText function returns a StreamTextResult. This result object contains the toDataStreamResponse function which converts the result to a streamed response object.
  const result = streamText({
    model: openrouter.chat("deepseek/deepseek-chat-v3-0324"),
    messages,
  });

  return result.toDataStreamResponse();
}
