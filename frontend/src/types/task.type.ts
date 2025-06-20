export interface Task {
  _id: string;
  title: string;
  description: string;
  completed:boolean
  priority?: string;
  dueDate?: string;
  subtasks?: any[];
  // Add other fields as needed
}
