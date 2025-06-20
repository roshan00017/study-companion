import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notesSlice'
import tasksReducer from './tasksSlice';
import flashcardReducer from './flashcardsSlice'

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    tasks: tasksReducer,
    flashcards: flashcardReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
