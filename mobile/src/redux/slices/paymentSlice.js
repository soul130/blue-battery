import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null,
  paymentMethods: ['credit_card', 'kakao_pay', 'toss'],
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setPayments: (state, action) => {
      state.payments = action.payload;
      state.error = null;
    },
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
    },
    addPayment: (state, action) => {
      state.payments.push(action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setPayments, setCurrentPayment, addPayment, setError } = paymentSlice.actions;
export default paymentSlice.reducer;
