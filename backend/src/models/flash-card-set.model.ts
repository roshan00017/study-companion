import mongoose, { Schema } from "mongoose";
import { IFlashcardSet } from "../types";

const FlashcardSetSchema = new Schema<IFlashcardSet>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
);

export const FlashcardSetModel = mongoose.model<IFlashcardSet>(
  "FlashcardSet",
  FlashcardSetSchema
);
