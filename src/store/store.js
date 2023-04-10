import {configureStore} from '@reduxjs/toolkit';
import TasksSlice from '../features/Tasks/TasksSlice';
import UserSlice from '../features/users/UserSlice';
const store = configureStore({
  reducer: {
    // Add your reducers here
    tasks: TasksSlice,
    user: UserSlice,
  },
});
export default store;
