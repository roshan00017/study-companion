export interface SubtaskPayload {
  title: string;
  completed?: boolean;
}
export interface TaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  subtasks?: SubtaskPayload[];
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  subtasks: { title: string; completed: boolean }[];
}
