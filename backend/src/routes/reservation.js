const express = require('express');
const reservationController = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 모든 보호된 라우트
router.post('/', protect, reservationController.createReservation);
router.get('/my', protect, reservationController.getMyReservations);
router.get('/:id', protect, reservationController.getReservation);
router.put('/:id', protect, reservationController.updateReservation);
router.delete('/:id', protect, reservationController.cancelReservation);

module.exports = router;
