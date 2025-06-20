import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Flashcard } from '../types/flashcard.type';

interface FlashcardsState {
  setId: string | null;
  cards: Flashcard[];
}

const initialState: FlashcardsState = {
  setId: null,
  cards: [],
};

const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    setFlashcards(state, action: PayloadAction<{ setId: string; cards: Flashcard[] }>) {
      state.setId = action.payload.setId;
      state.cards = action.payload.cards;
    },
    addFlashcard(state, action: PayloadAction<Flashcard>) {
      state.cards.unshift(action.payload);
    },
    removeFlashcard(state, action: PayloadAction<string>) {
      state.cards = state.cards.filter(card => card._id !== action.payload);
    },
    clearFlashcards(state) {
      state.setId = null;
      state.cards = [];
    },
  },
});

export const { setFlashcards, addFlashcard, removeFlashcard, clearFlashcards } = flashcardsSlice.actions;
export default flashcardsSlice.reducer;
