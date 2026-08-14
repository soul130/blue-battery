import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import store from './redux/store';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BatteryManagementPage from './pages/BatteryManagementPage';
import ReservationManagementPage from './pages/ReservationManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import StatisticsPage from './pages/StatisticsPage';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/batteries" element={<BatteryManagementPage />} />
              <Route path="/reservations" element={<ReservationManagementPage />} />
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
