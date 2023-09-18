import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  tasks: [],
  subtasks: [],
  habits: [],
  todayTasks: [],
  waffleChart: [],
};
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, {payload}) => {
      state.tasks = payload;
    },
    addTodaysTask: (state, {payload}) => {
      state.todayTasks = payload;
    },
    addSingleTask: (state, {payload}) => {
      state.tasks = [...state.tasks, payload];
    },
    updateSingleTask: (state, {payload}) => {
      const updatedTasks = state.tasks.map(task => {
        if (task._id === payload._id) {
          task = payload;
        }
        return task;
      });
      state.tasks = updatedTasks;
    },
    updateSingleSubTask: (state, {payload}) => {
      const updatedTasks = state.subtasks.map(task => {
        if (task._id === payload._id) {
          task = payload;
        }
        return task;
      });
      state.subtasks = updatedTasks;
    },
    removeTask: (state, {payload}) => {
      state.tasks = tasks.filter(task => task.id != payload);
    },
    addSubTasks: (state, {payload}) => {
      state.subtasks = payload;
    },
    addSingleSubTask: (state, {payload}) => {
      state.subtasks = [...state.subtasks, payload];
    },
    addHabits: (state, {payload}) => {
      state.habits = payload;
    },
    addWaffleChart: (state, {payload}) => {
      state.waffleChart = payload;
    },
  },
});
export const {
  addTask,
  addSingleTask,
  updateSingleTask,
  removeTask,
  addSubTasks,
  addSingleSubTask,
  addTodaysTask,
  addHabits,
  updateSingleSubTask,
  addWaffleChart,
} = tasksSlice.actions;
export default tasksSlice.reducer;
