import api from './api';

export const authAPI = {
  // 회원가입
  signup: (name, email, password, phone, address) =>
    api.post('/auth/signup', { name, email, password, phone, address }),

  // 로그인
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  // 프로필 조회
  getProfile: () =>
    api.get('/auth/profile'),

  // 프로필 수정
  updateProfile: (name, phone, address) =>
    api.put('/auth/profile', { name, phone, address }),
};

export const batteryAPI = {
  // 모든 배터리 조회
  getBatteries: (category, search) =>
    api.get('/battery', { params: { category, search } }),

  // 배터리 상세 조회
  getBattery: (id) =>
    api.get(`/battery/${id}`),
};

export const reservationAPI = {
  // 예약 생성
  createReservation: (batteryId, reservationDate, timeSlot, location, carInfo, notes) =>
    api.post('/reservation', {
      batteryId,
      reservationDate,
      timeSlot,
      location,
      carInfo,
      notes,
    }),

  // 내 예약 목록
  getMyReservations: () =>
    api.get('/reservation/my'),

  // 예약 상세 조회
  getReservation: (id) =>
    api.get(`/reservation/${id}`),

  // 예약 수정
  updateReservation: (id, reservationDate, timeSlot, location, carInfo, notes) =>
    api.put(`/reservation/${id}`, {
      reservationDate,
      timeSlot,
      location,
      carInfo,
      notes,
    }),

  // 예약 취소
  cancelReservation: (id) =>
    api.delete(`/reservation/${id}`),
};

export const paymentAPI = {
  // 결제 준비
  preparePayment: (reservationId, amount, paymentMethod) =>
    api.post('/payment/prepare', {
      reservationId,
      amount,
      paymentMethod,
    }),

  // 결제 완료
  completePayment: (impUid, merchantUid) =>
    api.post('/payment/complete', { impUid, merchantUid }),

  // 결제 취소
  cancelPayment: (impUid, reason) =>
    api.post('/payment/cancel', { impUid, reason }),

  // 결제 내역 조회
  getPaymentHistory: () =>
    api.get('/payment/history'),
};
