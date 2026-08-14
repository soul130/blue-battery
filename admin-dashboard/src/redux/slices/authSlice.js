import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.error = null;
    },
  },
});

export const { setLoading, setAdmin, setError, logout } = authSlice.actions;
export default authSlice.reducer;
