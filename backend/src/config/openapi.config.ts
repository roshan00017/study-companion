import { env } from "./env.js";

/** Gemini's current text-generation REST API. */
const INTERACTIONS_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";

interface InteractionStep {
  type?: string;
  content?: { type?: string; text?: string }[];
}

export async function askAI(
  messages: { role: "system" | "user" | "assistant"; content: string }[]
) {
  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const candidateModels = (env.GEMINI_MODELS ?? "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
  const models = [env.GEMINI_MODEL, ...candidateModels].filter(
    (model, index, all) => all.indexOf(model) === index,
  );

  let i = 0;
  while (i < models.length) {
    const model = models[i];
    try {
      const res = await fetch(INTERACTIONS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          model,
          input: formattedMessages,
          system_instruction: "",
          generation_config: { temperature: 0.5 },
          store: false,
        }),
      });

      if (res.status === 429) {
        i++;
        continue;
      }
      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(`AI provider error (HTTP ${res.status}): ${errorText}`);
      }

      const data = (await res.json()) as { steps?: InteractionStep[] };
      const outputStep = [...(data.steps ?? [])]
        .reverse()
        .find((step) => step?.type === "model_output");
      const text = (outputStep?.content ?? [])
        .filter((content) => content?.type === "text")
        .map((content) => content.text ?? "")
        .join("")
        .trim();

      if (text) {
        return text;
      }
      i++;
    } catch (err) {
      const rateLimited = (err as Error).message?.includes("429");
      if (rateLimited) {
        i++;
        continue;
      }
      throw err;
    }
  }

  throw new Error("AI provider returned no response from any model candidate");
}