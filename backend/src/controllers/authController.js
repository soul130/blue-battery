const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT 토큰 생성
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// 회원가입
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: '필수 정보를 입력해주세요.' });
    }

    // 이메일 중복 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
    }

    const user = new User({ name, email, password, phone, address });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: '유효하지 않은 이메일 또는 비밀번호입니다.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: '유효하지 않은 이메일 또는 비밀번호입니다.' });
    }

    const token = generateToken(user._id);
    res.json({
      message: '로그인이 완료되었습니다.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 프로필 조회
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 프로필 업데이트
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, updatedAt: Date.now() },
      { new: true }
    );
    res.json({
      message: '프로필이 업데이트되었습니다.',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
