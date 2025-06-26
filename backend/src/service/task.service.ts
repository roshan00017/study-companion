import { TaskModel } from "../models";
import { CreateTaskDto, UpdateTaskDto, ITask } from "../types";

class TaskService {
  async createTask(userId: string, taskData: CreateTaskDto): Promise<ITask> {
    return await TaskModel.create({ userId, ...taskData });
  }

  async getTasks(userId: string, groupId?: string): Promise<ITask[]> {
    if (groupId) {
      return await TaskModel.find({ groupId }).sort({ updatedAt: -1 });
    }
    return await TaskModel.find({ userId }).sort({ updatedAt: -1 });
  }

  async getTaskById(taskId: string, userId: string): Promise<ITask | null> {
    return await TaskModel.findOne({ _id: taskId, userId });
  }

  async updateTask(
    taskId: string,
    userId: string,
    updateData: UpdateTaskDto
  ): Promise<ITask | null> {
    return await TaskModel.findOneAndUpdate(
      { _id: taskId, userId },
      updateData,
      { new: true }
    );
  }

  async deleteTask(taskId: string, userId: string): Promise<ITask | null> {
    return await TaskModel.findOneAndDelete({ _id: taskId, userId });
  }
}

export default new TaskService();
