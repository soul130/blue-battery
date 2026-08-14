const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 토큰 검증
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 없습니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: '토큰이 유효하지 않습니다.' });
  }
};

// 관리자 권한 확인
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: '관리자 권한이 필요합니다.' });
  }
};

module.exports = { protect, adminOnly };
