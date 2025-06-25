import { Response, NextFunction } from "express";

import { AuthRequest, CreateTaskDto, UpdateTaskDto } from "../types";
import { ApiError, sendSuccess } from "../utils/response.utils";
import { taskService } from "../service";

class TaskController {
  async createTask(
    req: AuthRequest<CreateTaskDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const task = await taskService.createTask(userId, req.body);
      sendSuccess(res, "Task created successfully", task, 201);
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const groupId = req.query.groupId as string | undefined;
      const tasks = await taskService.getTasks(userId, groupId);
      sendSuccess(res, "Tasks fetched successfully", tasks);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const task = await taskService.getTaskById(id, userId);
      if (!task) {
        throw new ApiError(404, "Task not found");
      }

      sendSuccess(res, "Task fetched successfully", task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(
    req: AuthRequest<UpdateTaskDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const task = await taskService.updateTask(id, userId, req.body);
      if (!task) {
        throw new ApiError(404, "Task not found");
      }

      sendSuccess(res, "Task updated successfully", task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const task = await taskService.deleteTask(id, userId);
      if (!task) {
        throw new ApiError(404, "Task not found");
      }

      sendSuccess(res, "Task deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();
