const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  batteryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battery',
    required: true
  },
  reservationDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true // "09:00-10:00", "10:00-11:00" 등
  },
  location: {
    type: String,
    required: true
  },
  carInfo: {
    carModel: String,
    carYear: String,
    licensePlate: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
