import type { NotePayload } from "../../types/note.type";
import api from "../api";

export const getNotes = async (groupId?: string) => {
  const url = groupId
    ? `/notes?groupId=${encodeURIComponent(groupId)}`
    : "/notes";
  const res = await api.get(url);
  return res.data.data;
};

export const createNote = async (data: NotePayload) => {
  const res = await api.post("/notes", data);
  return res.data.data;
};

export const deleteNote = async (id: string) => {
  await api.delete(`/notes/${id}`);
};

export const updateNote = async (id: string, data: NotePayload) => {
  const res = await api.put(`/notes/${id}`, data);
  return res.data.data;
};
