const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Battery = require('../models/Battery');

const router = express.Router();

// 모든 어드민 라우트는 인증 + 관리자 권한 필요
router.use(protect, adminOnly);

// 예약 현황 조회
router.get('/reservations', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (startDate || endDate) {
      query.reservationDate = {};
      if (startDate) query.reservationDate.$gte = new Date(startDate);
      if (endDate) query.reservationDate.$lte = new Date(endDate);
    }

    const reservations = await Reservation.find(query)
      .populate('userId')
      .populate('batteryId')
      .populate('paymentId')
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 예약 상태 업데이트
router.put('/reservations/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status, notes, updatedAt: Date.now() },
      { new: true }
    ).populate('userId').populate('batteryId');

    res.json({
      message: '예약 상태가 업데이트되었습니다.',
      reservation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 매출 통계
router.get('/statistics/revenue', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { paymentStatus: 'completed' };

    if (startDate || endDate) {
      query.completedAt = {};
      if (startDate) query.completedAt.$gte = new Date(startDate);
      if (endDate) query.completedAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query);
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const paymentMethodStats = {};

    payments.forEach(p => {
      if (!paymentMethodStats[p.paymentMethod]) {
        paymentMethodStats[p.paymentMethod] = { count: 0, amount: 0 };
      }
      paymentMethodStats[p.paymentMethod].count++;
      paymentMethodStats[p.paymentMethod].amount += p.amount;
    });

    res.json({
      totalRevenue,
      totalPayments: payments.length,
      paymentMethodStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사용자 관리 - 모든 사용자 조회
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사용자 역할 변경
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    res.json({
      message: '사용자 역할이 변경되었습니다.',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 대시보드 요약
router.get('/dashboard/summary', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    const confirmedReservations = await Reservation.countDocuments({ status: 'confirmed' });
    const completedReservations = await Reservation.countDocuments({ status: 'completed' });
    const cancelledReservations = await Reservation.countDocuments({ status: 'cancelled' });
    const totalBatteries = await Battery.countDocuments();

    const payments = await Payment.find({ paymentStatus: 'completed' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalUsers,
      totalReservations,
      pendingReservations,
      confirmedReservations,
      completedReservations,
      cancelledReservations,
      totalBatteries,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
