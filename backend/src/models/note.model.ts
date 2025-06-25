import mongoose, { Schema, Document } from "mongoose";
import { INote } from "../types/note.types";

const NoteSchema = new Schema<INote>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false,
    },
    groupId: { type: String, require: false },
  },
  { timestamps: true }
);

export const NoteModel = mongoose.model<INote>("Note", NoteSchema);
