import { Groq } from "groq-sdk";
import type { ChatCompletion } from "groq-sdk/resources/chat/completions.mjs";
import { defineEventHandler, type EventHandlerRequest, type H3Event } from "h3";
import { getMappedError } from "~/server/app/errors/errorMapper";
const bookError = (type: string, message: string) =>
  getMappedError(type, message);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export default defineEventHandler(
  async (event: H3Event<EventHandlerRequest>) => {
    const bookId = getRouterParam(event, "bookId");
    if (!bookId) throw new Error("Book ID is required");
    const { content } = await readBody(event);
    if (!content) throw new Error("Content is required");
    try {
      const response: ChatCompletion = await getGroqChatStream(content);
      return response;
    } catch (error) {
      const e = error as {
        error: { error: { type: string; code?: string; message: string } };
      };
      return sendError(
        event,
        createError({
          statusCode: 401,
          data: bookError(
            e.error.error.code || e.error.error.type,
            e.error.error.message
          ),
        })
      );
    }
  }
);
export async function getGroqChatStream(content: string) {
  return groq.chat.completions.create({
    messages: [
      { role: "system", content: content.slice(0, 30000) },
      {
        role: "user",
        content:
          "I want to analyze this book, Identify key characters, language detection, Sentiment Analysis and Plot Summary. Response should only contain the analysis.",
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: false,
  });
}
