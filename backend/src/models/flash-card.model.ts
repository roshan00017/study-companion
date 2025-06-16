import mongoose, { Schema } from "mongoose";
import { IFlashcard } from "../types";

const FlashcardSchema = new Schema<IFlashcard>(
  {
    userId: { type: String, required: true },
    setId: {
      type:String,
      ref: "FlashcardSet",
      required: true,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

export const FlashcardModel = mongoose.model<IFlashcard>(
  "Flashcard",
  FlashcardSchema
);
