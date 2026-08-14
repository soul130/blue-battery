import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.error = null;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(u => u._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setUsers, updateUser, setError } = userSlice.actions;
export default userSlice.reducer;
