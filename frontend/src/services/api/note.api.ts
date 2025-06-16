import type { NotePayload } from "../../types/note.type";
import api from "../api";

export const getNotes = async () => {
  const res = await api.get("api/notes");
  return res.data.data;
};

export const createNote = async (data: NotePayload) => {
  const res = await api.post("api/notes", data);
  return res.data.data;
};

export const deleteNote = async (id: string) => {
  await api.delete(`api/notes/${id}`);
};

export const updateNote = async (id: string, data: NotePayload) => {
  const res = await api.put(`/notes/${id}`, data);
  return res.data.data;
};
