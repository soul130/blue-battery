import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reservations: [],
  currentReservation: null,
  isLoading: false,
  error: null,
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setReservations: (state, action) => {
      state.reservations = action.payload;
      state.error = null;
    },
    setCurrentReservation: (state, action) => {
      state.currentReservation = action.payload;
    },
    addReservation: (state, action) => {
      state.reservations.push(action.payload);
    },
    updateReservation: (state, action) => {
      const index = state.reservations.findIndex(r => r._id === action.payload._id);
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
    },
    removeReservation: (state, action) => {
      state.reservations = state.reservations.filter(r => r._id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setReservations,
  setCurrentReservation,
  addReservation,
  updateReservation,
  removeReservation,
  setError,
} = reservationSlice.actions;
export default reservationSlice.reducer;
