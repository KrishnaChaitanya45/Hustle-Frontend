import {configureStore} from '@reduxjs/toolkit';
import TasksSlice from '../features/Tasks/TasksSlice';
import UserSlice from '../features/users/UserSlice';
import SocketSlice from '../features/Socket/SocketSlice';
const store = configureStore({
  reducer: {
    // Add your reducers here
    tasks: TasksSlice,
    user: UserSlice,
    socket: SocketSlice,
  },
});
export default store;
