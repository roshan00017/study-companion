import { OpenAI } from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function askAI(
  messages: { role: "system" | "user" | "assistant"; content: string }[]
) {
  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",

    messages,
  });

  const reply = response.choices[0].message;
  return reply;
}
