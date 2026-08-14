import { GoogleGenerativeAI } from "@google/genai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function askAI(
  messages: { role: "system" | "user" | "assistant"; content: string }[]
) {
  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const result = await model.generateContent({
    contents: formattedMessages,
  });

  const reply = result.text();
  return reply;
}
