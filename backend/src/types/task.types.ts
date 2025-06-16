export interface ISubTask {
  title: string;
  completed: boolean;
}

export interface ITask {
  _id?: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  completed: boolean;
  subtasks: ISubTask[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  subtasks?: ISubTask[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  subtasks?: ISubTask[];
}
