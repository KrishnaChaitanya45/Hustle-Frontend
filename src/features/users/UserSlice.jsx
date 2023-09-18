import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  user: [],
  friends: [],
};
const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, {payload}) => {
      state.user = payload;
    },
    updateUser: (state, {payload}) => {
      state.user = payload;
    },
    addFriends: (state, {payload}) => {
      state.friends = payload;
    },
  },
});
export const {addUser, updateUser, addFriends} = UserSlice.actions;
export default UserSlice.reducer;
