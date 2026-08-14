const express = require('express');
const batteryController = require('../controllers/batteryController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// 모든 사용자 접근 가능
router.get('/', batteryController.getAllBatteries);
router.get('/:id', batteryController.getBattery);

// 관리자만 접근 가능
router.post('/', protect, adminOnly, batteryController.addBattery);
router.put('/:id', protect, adminOnly, batteryController.updateBattery);
router.delete('/:id', protect, adminOnly, batteryController.deleteBattery);

module.exports = router;
