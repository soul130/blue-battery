const Reservation = require('../models/Reservation');
const Battery = require('../models/Battery');

// 예약 생성
exports.createReservation = async (req, res) => {
  try {
    const { batteryId, reservationDate, timeSlot, location, carInfo, notes } = req.body;

    // 배터리 확인
    const battery = await Battery.findById(batteryId);
    if (!battery) {
      return res.status(404).json({ error: '배터리를 찾을 수 없습니다.' });
    }

    if (battery.stock <= 0) {
      return res.status(400).json({ error: '재고가 부족합니다.' });
    }

    const reservation = new Reservation({
      userId: req.user.id,
      batteryId,
      reservationDate,
      timeSlot,
      location,
      carInfo,
      notes,
      status: 'pending'
    });

    await reservation.save();

    res.status(201).json({
      message: '예약이 생성되었습니다.',
      reservation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 사용자 예약 목록 조회
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .populate('batteryId')
      .populate('paymentId')
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 예약 상세 조회
exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('batteryId')
      .populate('paymentId');

    if (!reservation) {
      return res.status(404).json({ error: '예약을 찾을 수 없습니다.' });
    }

    // 본인 예약만 조회 가능 (관리자는 제외)
    if (req.user.role !== 'admin' && reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: '접근 권한이 없습니다.' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 예약 수정
exports.updateReservation = async (req, res) => {
  try {
    const { reservationDate, timeSlot, location, carInfo, notes } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: '예약을 찾을 수 없습니다.' });
    }

    // 본인 예약만 수정 가능
    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: '접근 권한이 없습니다.' });
    }

    // 완료된 예약은 수정 불가
    if (reservation.status === 'completed' || reservation.status === 'cancelled') {
      return res.status(400).json({ error: '이 예약은 수정할 수 없습니다.' });
    }

    reservation.reservationDate = reservationDate || reservation.reservationDate;
    reservation.timeSlot = timeSlot || reservation.timeSlot;
    reservation.location = location || reservation.location;
    reservation.carInfo = carInfo || reservation.carInfo;
    reservation.notes = notes || reservation.notes;
    reservation.updatedAt = Date.now();

    await reservation.save();

    res.json({
      message: '예약이 수정되었습니다.',
      reservation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 예약 취소
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: '예약을 찾을 수 없습니다.' });
    }

    // 본인 예약만 취소 가능
    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: '접근 권한이 없습니다.' });
    }

    if (reservation.status === 'completed' || reservation.status === 'cancelled') {
      return res.status(400).json({ error: '이 예약은 취소할 수 없습니다.' });
    }

    reservation.status = 'cancelled';
    reservation.updatedAt = Date.now();
    await reservation.save();

    res.json({
      message: '예약이 취소되었습니다.',
      reservation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
