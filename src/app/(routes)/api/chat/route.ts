//import { openai } from "@ai-sdk/openai";
"use server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { createClient } from "@/utils/supabase/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export async function POST(req: Request) {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  //extract messages from post request
  const { messages } = await req.json();

  //streamText function returns a StreamTextResult. This result object contains the toDataStreamResponse function which converts the result to a streamed response object.
  const result = streamText({
    model: openrouter.chat("deepseek/deepseek-chat-v3-0324"),
    system: "You are a law assistant that is helping a lawyer in Hong Kong",
    messages,
  });

  return result.toDataStreamResponse();
}
