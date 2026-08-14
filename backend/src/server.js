const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// 미들웨어
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 라우트 임포트
const authRoutes = require('./routes/auth');
const batteryRoutes = require('./routes/battery');
const reservationRoutes = require('./routes/reservation');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/battery', batteryRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '블루배터리 API 서버 v1.0' });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app;
