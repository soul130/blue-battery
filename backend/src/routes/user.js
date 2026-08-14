const express = require('express');
const { protect } = require('../middleware/auth');
const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');

const router = express.Router();

// 사용자 마이페이지 - 예약 현황
router.get('/dashboard', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id }).populate('batteryId');
    const payments = await Payment.find({ userId: req.user.id });

    const totalReservations = reservations.length;
    const pendingReservations = reservations.filter(r => r.status === 'pending').length;
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
    const completedReservations = reservations.filter(r => r.status === 'completed').length;
    const totalSpent = payments.filter(p => p.paymentStatus === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalReservations,
      pendingReservations,
      confirmedReservations,
      completedReservations,
      totalSpent,
      recentReservations: reservations.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
