import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../types/task.type';

interface TasksState {
  items: Task[];
}

const initialState: TasksState = {
  items: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.items = action.payload;
    },
    addTask(state, action: PayloadAction<Task>) {
      state.items.unshift(action.payload);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const idx = state.items.findIndex(t => t._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter(t => t._id !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;
