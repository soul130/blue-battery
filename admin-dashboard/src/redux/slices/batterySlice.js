import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  batteries: [],
  selectedBattery: null,
  isLoading: false,
  error: null,
};

const batterySlice = createSlice({
  name: 'battery',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setBatteries: (state, action) => {
      state.batteries = action.payload;
      state.error = null;
    },
    setSelectedBattery: (state, action) => {
      state.selectedBattery = action.payload;
    },
    addBattery: (state, action) => {
      state.batteries.push(action.payload);
    },
    updateBattery: (state, action) => {
      const index = state.batteries.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.batteries[index] = action.payload;
      }
    },
    removeBattery: (state, action) => {
      state.batteries = state.batteries.filter(b => b._id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setBatteries, setSelectedBattery, addBattery, updateBattery, removeBattery, setError } = batterySlice.actions;
export default batterySlice.reducer;
