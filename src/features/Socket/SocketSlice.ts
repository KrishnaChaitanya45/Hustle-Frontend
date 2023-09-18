import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  messagesSocket: undefined,
  userSocket: undefined,
  personalChats: [],
  groupChats: [],
  friends: [],
  notifications: [],
  deviceToken: null,
};
const SocketsSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    addMessagesSocket(state, action) {
      state.messagesSocket = action.payload;
    },
    addUserSocket(state, action) {
      state.userSocket = action.payload;
    },
    addFriends: (state, action) => {
      state.friends = action.payload;
    },
    addNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification._id !== action.payload,
      );
    },
    addPersonalChats: (state, action) => {
      state.personalChats = action.payload;
    },
    setDeviceToken: (state, action) => {
      state.deviceToken = action.payload;
    },
    addGroupChats: (state, action) => {
      state.groupChats = action.payload;
    },
  },
});
export const {
  addMessagesSocket,
  addUserSocket,
  addGroupChats,
  addNotifications,
  setDeviceToken,
  removeNotification,
  addPersonalChats,
  addFriends,
} = SocketsSlice.actions;
export default SocketsSlice.reducer;
