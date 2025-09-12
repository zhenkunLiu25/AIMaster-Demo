import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, FilterOptions, TaskPriority, TaskStatus } from '../types';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  searchQuery: string;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {},
  searchQuery: '',
};

// Async thunks for task operations
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    // In a real app, this would fetch from an API
    const storedTasks = localStorage.getItem('nus-tasks');
    if (storedTasks) {
      return JSON.parse(storedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    }
    return [];
  }
);

export const saveTask = createAsyncThunk(
  'tasks/saveTask',
  async (task: Task) => {
    // In a real app, this would save to an API
    const storedTasks = localStorage.getItem('nus-tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    const existingIndex = tasks.findIndex((t: Task) => t.id === task.id);
    
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }
    
    localStorage.setItem('nus-tasks', JSON.stringify(tasks));
    return task;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    const storedTasks = localStorage.getItem('nus-tasks');
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks);
      const filteredTasks = tasks.filter((t: Task) => t.id !== taskId);
      localStorage.setItem('nus-tasks', JSON.stringify(filteredTasks));
    }
    return taskId;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FilterOptions>) => {
      state.filters = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: TaskStatus }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.updatedAt = new Date();
        // Persist to localStorage
        localStorage.setItem('nus-tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: TaskPriority }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.priority = action.payload.priority;
        task.updatedAt = new Date();
        // Persist to localStorage
        localStorage.setItem('nus-tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskDueDate: (state, action: PayloadAction<{ id: string; dueDate: Date }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.dueDate = action.payload.dueDate;
        task.updatedAt = new Date();
        // Persist to localStorage
        localStorage.setItem('nus-tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskEstimatedHours: (state, action: PayloadAction<{ id: string; estimatedHours: number | undefined }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.estimatedHours = action.payload.estimatedHours;
        task.updatedAt = new Date();
        // Persist to localStorage
        localStorage.setItem('nus-tasks', JSON.stringify(state.tasks));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(saveTask.fulfilled, (state, action) => {
        const existingIndex = state.tasks.findIndex(t => t.id === action.payload.id);
        if (existingIndex >= 0) {
          state.tasks[existingIndex] = action.payload;
        } else {
          state.tasks.push(action.payload);
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});

export const { setFilters, setSearchQuery, updateTaskStatus, updateTaskPriority, updateTaskDueDate, updateTaskEstimatedHours } = taskSlice.actions;
export default taskSlice.reducer;
