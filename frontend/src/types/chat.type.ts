export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface QuickPrompt {
  label: string;
  text?: string;
  action?: () => void;
}

export interface SelectableItem {
  _id: string;
  title: string;
  content?: string;
  description?: string;
  priority?: string;
  dueDate?: string;
}
