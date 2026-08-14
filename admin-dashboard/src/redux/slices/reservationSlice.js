import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reservations: [],
  selectedReservation: null,
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
    updateReservation: (state, action) => {
      const index = state.reservations.findIndex(r => r._id === action.payload._id);
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setReservations, updateReservation, setError } = reservationSlice.actions;
export default reservationSlice.reducer;
