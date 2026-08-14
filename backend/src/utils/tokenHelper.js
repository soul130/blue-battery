# JWT 토큰 문제 해결

## 토큰 검증 미들웨어 개선

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Authorization 헤더에서 토큰 추출
  if (req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({ 
      error: '인증 토큰이 없습니다.',
      code: 'NO_TOKEN'
    });
  }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 사용자 조회
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        error: '사용자를 찾을 수 없습니다.',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: '토큰이 만료되었습니다.',
        code: 'TOKEN_EXPIRED',
        expiredAt: error.expiredAt
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: '토큰이 유효하지 않습니다.',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(401).json({ 
      error: '토큰 검증 중 오류가 발생했습니다.',
      code: 'TOKEN_ERROR'
    });
  }
};

module.exports = { protect };
