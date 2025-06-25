import type { Task, TaskPayload } from "../../types/task.type";
import api from "../api";

export const getTasks = async (groupId?: string): Promise<Task[]> => {
  const url = groupId
    ? `/tasks?groupId=${encodeURIComponent(groupId)}`
    : "/tasks";
  return (await api.get(url)).data.data;
};
export const createTask = async (task: TaskPayload) =>
  (await api.post("/tasks", task)).data.data;
export const updateTask = async (id: string, data: Task) =>
  (await api.put(`/tasks/${id}`, data)).data.data;
export const deleteTask = async (id: string) => api.delete(`/tasks/${id}`);

export const getNotesByTaskId = async (taskId: string) => {
  const res = await api.get(`/notes/task/${taskId}`);
  return res.data.data;
};
