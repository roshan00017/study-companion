export function getSystemPrompt(
  section: "notes" | "tasks" | "flashcards" | "dashboard"
): string {
  switch (section) {
    case "notes":
      return "You are a helpful AI that assists users in summarizing and managing study notes clearly and effectively.";
    case "tasks":
      return "You are an AI productivity assistant helping users create and manage tasks related to their study goals.";
    case "flashcards":
      return "You help users generate flashcards in the format: Q: ... A: ..., based on study material.";
    case "dashboard":
    default:
      return "You are a friendly study companion helping users manage notes, tasks, and flashcards.";
  }
}

export const EXAMPLE_STRUCTURES = {
  task: {
    title: "JavaScript Promises Study Plan",
    description: "Comprehensive study plan to master JavaScript Promises",
    priority: "medium",
    dueDate: "2024-03-20T00:00:00.000Z",
    subtasks: [
      { title: "Read MDN documentation on Promises", completed: false },
      { title: "Practice Promise chaining", completed: false },
      { title: "Build a small async project", completed: false },
    ],
  },
  note: {
    title: "Understanding JavaScript Promises",
    content:
      "# JavaScript Promises\n\n## Overview\nPromises are objects representing eventual completion of an async operation...",
    tags: ["javascript", "async", "promises"],
    taskId: null,
  },
  flashcard: [
    {
      question: "What is a Promise in JavaScript?",
      answer:
        "A Promise is an object representing eventual completion/failure of an async operation",
    },
  ],
};

export function getGenerateSystemPrompt(
  type: "task" | "note" | "flashcard"
): string {
  return `You are an AI that generates structured ${type} content. 
IMPORTANT: Respond ONLY with valid JSON matching the example structure. 
Do not include any explanatory text or markdown formatting outside the JSON.`;
}

export function getPromptForType(
  type: "task" | "note" | "flashcard",
  topic: string
): string {
  if (type === "note") {
    return `Generate a note about: "${topic}"
Requirements:
- Use HTML tags such as <h1>, <h2>, <ul>, <li>, <b>, <i>, <p>, etc. for formatting.
- Do NOT use markdown (#, ##, etc.).
- The note content must be at least two paragraphs and should not be short.
- Respond ONLY with valid JSON matching the example structure below (no extra text or markdown):

${JSON.stringify(EXAMPLE_STRUCTURES.note, null, 2)}
`;
  }
  return `Generate ${
    type === "flashcard" ? "5 flashcards" : `a ${type}`
  } about: "${topic}"
Using EXACTLY this structure (respond with JSON only):

${JSON.stringify(EXAMPLE_STRUCTURES[type], null, 2)}
`;
} 