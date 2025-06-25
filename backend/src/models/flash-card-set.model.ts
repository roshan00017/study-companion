import mongoose, { Schema } from "mongoose";
import { IFlashcardSet } from "../types";

const FlashcardSetSchema = new Schema<IFlashcardSet>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    groupId: {type: String, require: false}
  },
  { timestamps: true }
);

export const FlashcardSetModel = mongoose.model<IFlashcardSet>(
  "FlashcardSet",
  FlashcardSetSchema
);
