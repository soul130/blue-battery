const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 모든 결제 라우트는 인증 필요
router.post('/prepare', protect, paymentController.preparePayment);
router.post('/complete', protect, paymentController.completePayment);
router.post('/cancel', protect, paymentController.cancelPayment);
router.get('/history', protect, paymentController.getPaymentHistory);

module.exports = router;
