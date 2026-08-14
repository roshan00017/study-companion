import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function askAI(
  messages: { role: "system" | "user" | "assistant"; content: string }[]
) {
  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const result = await genAI.models.generateContent({
    model: "gemini-1.5-flash",
    contents: formattedMessages,
  });

  const reply = result.text();
  return reply;
}n

