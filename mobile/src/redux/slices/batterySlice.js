import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  batteries: [],
  selectedBattery: null,
  isLoading: false,
  error: null,
  filters: {
    category: null,
    search: '',
  },
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
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export const { setLoading, setBatteries, setSelectedBattery, setError, setFilters } = batterySlice.actions;
export default batterySlice.reducer;
