import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  user: [],
};
const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, {payload}) => {
      state.user = payload;
    },
    updateUser : (state, {payload}) => {
      state.user = payload;
    },
  },
});
export const {addUser, updateUser} = UserSlice.actions;
export default UserSlice.reducer;
