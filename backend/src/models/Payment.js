const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    default: null
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'kakao_pay', 'toss'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  impUid: {
    type: String,
    unique: true,
    sparse: true
  },
  merchantUid: {
    type: String,
    unique: true
  },
  paymentDetails: {
    cardName: String,
    cardNumber: String,
    bankCode: String,
    bankName: String
  },
  errorMessage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
