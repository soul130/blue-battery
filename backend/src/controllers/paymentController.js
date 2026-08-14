const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');
const axios = require('axios');

// Iamport API 헤더 설정
const getIamportHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
};

// Iamport 액세스 토큰 획득
const getIamportToken = async () => {
  try {
    const response = await axios.post('https://api.iamport.kr/users/getToken', {
      imp_key: process.env.IAMPORT_KEY,
      imp_secret: process.env.IAMPORT_SECRET
    });
    return response.data.response.access_token;
  } catch (error) {
    throw new Error('Iamport 토큰 획득 실패');
  }
};

// 결제 준비 (결제 ID 생성)
exports.preparePayment = async (req, res) => {
  try {
    const { reservationId, amount, paymentMethod } = req.body;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: '예약을 찾을 수 없습니다.' });
    }

    const merchantUid = `BLUE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const payment = new Payment({
      userId: req.user.id,
      reservationId,
      amount,
      paymentMethod,
      merchantUid,
      paymentStatus: 'pending'
    });

    await payment.save();

    res.json({
      message: '결제가 준비되었습니다.',
      merchantUid,
      paymentId: payment._id,
      amount,
      paymentMethod
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 결제 완료 (서버 검증)
exports.completePayment = async (req, res) => {
  try {
    const { impUid, merchantUid } = req.body;

    // 결제 정보 조회
    const token = await getIamportToken();
    const response = await axios.get(
      `https://api.iamport.kr/payments/${impUid}`,
      { headers: { Authorization: token } }
    );

    const paymentData = response.data.response;

    // Payment 레코드 찾기
    const payment = await Payment.findOne({ merchantUid });
    if (!payment) {
      return res.status(404).json({ error: '결제 정보를 찾을 수 없습니다.' });
    }

    // 금액 검증
    if (paymentData.amount !== payment.amount) {
      payment.paymentStatus = 'failed';
      payment.errorMessage = '결제 금액이 일치하지 않습니다.';
      await payment.save();
      return res.status(400).json({ error: '결제 금액이 일치하지 않습니다.' });
    }

    // 결제 상태 업데이트
    if (paymentData.status === 'paid') {
      payment.impUid = impUid;
      payment.paymentStatus = 'completed';
      payment.completedAt = new Date();
      payment.paymentDetails = {
        cardName: paymentData.card_name || paymentData.bank_name,
        cardNumber: paymentData.card_number,
        bankCode: paymentData.bank_code,
        bankName: paymentData.bank_name
      };
      await payment.save();

      // 예약 상태 업데이트
      if (payment.reservationId) {
        await Reservation.findByIdAndUpdate(
          payment.reservationId,
          { status: 'confirmed', paymentId: payment._id }
        );
      }

      res.json({
        message: '결제가 완료되었습니다.',
        payment,
        paymentData
      });
    } else {
      payment.paymentStatus = 'failed';
      payment.errorMessage = '결제가 실패했습니다.';
      await payment.save();
      res.status(400).json({ error: '결제가 실패했습니다.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 결제 취소
exports.cancelPayment = async (req, res) => {
  try {
    const { impUid, reason } = req.body;

    const token = await getIamportToken();

    const response = await axios.post(
      'https://api.iamport.kr/payments/cancel',
      {
        imp_uid: impUid,
        reason: reason || '사용자 요청'
      },
      { headers: { Authorization: token } }
    );

    const payment = await Payment.findOne({ impUid });
    if (payment) {
      payment.paymentStatus = 'cancelled';
      await payment.save();

      if (payment.reservationId) {
        await Reservation.findByIdAndUpdate(
          payment.reservationId,
          { status: 'cancelled' }
        );
      }
    }

    res.json({
      message: '결제가 취소되었습니다.',
      response: response.data.response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 결제 내역 조회
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate('reservationId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
