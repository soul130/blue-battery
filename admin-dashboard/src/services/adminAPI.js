import api from './api';

export const adminAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getDashboardSummary: () =>
    api.get('/admin/dashboard/summary'),

  // 배터리
  getBatteries: () =>
    api.get('/battery'),

  addBattery: (data) =>
    api.post('/battery', data),

  updateBattery: (id, data) =>
    api.put(`/battery/${id}`, data),

  deleteBattery: (id) =>
    api.delete(`/battery/${id}`),

  // 예약
  getReservations: (status, startDate, endDate) =>
    api.get('/admin/reservations', {
      params: { status, startDate, endDate },
    }),

  updateReservation: (id, data) =>
    api.put(`/admin/reservations/${id}`, data),

  // 사용자
  getUsers: () =>
    api.get('/admin/users'),

  updateUserRole: (id, role) =>
    api.put(`/admin/users/${id}/role`, { role }),

  // 통계
  getRevenue: (startDate, endDate) =>
    api.get('/admin/statistics/revenue', {
      params: { startDate, endDate },
    }),
};
