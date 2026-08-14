# Blue Battery 백엔드 - 테스트 설정

const request = require('supertest');
const app = require('../server');

describe('Authentication API', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: '테스트 사용자',
          email: 'test@example.com',
          password: 'password123',
          phone: '01012345678'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should not create user with duplicate email', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: '사용자1',
          email: 'duplicate@example.com',
          password: 'password123',
          phone: '01012345678'
        });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: '사용자2',
          email: 'duplicate@example.com',
          password: 'password123',
          phone: '01012345678'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('이미 사용 중인 이메일입니다.');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: '사용자',
          email: 'login@example.com',
          password: 'password123',
          phone: '01012345678'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
