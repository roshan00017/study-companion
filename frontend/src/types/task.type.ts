export interface SubtaskPayload {
  title: string;
  completed?: boolean;
}
export interface TaskPayload {
  _id?: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  subtasks?: SubtaskPayload[];
  groupId?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
  subtasks?: any[];
  groupId?: string;
  // Add other fields as needed
}
