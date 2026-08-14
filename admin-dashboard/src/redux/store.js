import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import batteryReducer from './slices/batterySlice';
import reservationReducer from './slices/reservationSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    battery: batteryReducer,
    reservation: reservationReducer,
    user: userReducer,
  },
});

export default store;
