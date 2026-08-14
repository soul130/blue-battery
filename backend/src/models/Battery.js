const mongoose = require('mongoose');

const batterySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  specifications: {
    capacity: String,
    voltage: String,
    warranty: String
  },
  image: {
    type: String,
    default: null
  },
  stock: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['standard', 'premium', 'professional'],
    default: 'standard'
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Battery', batterySchema);
