import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import batteryReducer from './slices/batterySlice';
import reservationReducer from './slices/reservationSlice';
import paymentReducer from './slices/paymentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    battery: batteryReducer,
    reservation: reservationReducer,
    payment: paymentReducer,
  },
});

export default store;
