const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 공개 라우트
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// 보호된 라우트 (로그인 필요)
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
