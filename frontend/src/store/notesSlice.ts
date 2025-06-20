import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Note } from "../types/note.type";

interface NotesState {
  items: Note[];
}

const initialState: NotesState = {
  items: [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes(state, action: PayloadAction<Note[]>) {
      state.items = action.payload;
    },
  addNote(state, action: PayloadAction<Note>) {
      state.items.unshift(action.payload);
    },
    updateNote(state, action: PayloadAction<Note>) {
      const idx = state.items.findIndex(n => n._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeNote(state, action: PayloadAction<string>) {
      state.items = state.items.filter(n => n._id !== action.payload);
    },
  },
});

export const { setNotes, addNote, updateNote, removeNote } = notesSlice.actions;
export default notesSlice.reducer;
