import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdmin, setError } from '../redux/slices/authSlice';
import { adminAPI } from '../services/adminAPI';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await adminAPI.login(values.email, values.password);
      const { token, user } = response.data;

      // 관리자 권한 확인
      if (user.role !== 'admin') {
        message.error('관리자 권한이 없습니다.');
        dispatch(setError('관리자 권한이 없습니다.'));
        return;
      }

      localStorage.setItem('adminToken', token);
      dispatch(setAdmin({ user, token }));
      message.success('로그인 성공!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.error || '로그인에 실패했습니다.';
      dispatch(setError(errorMessage));
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="🔵 블루배터리 관리자 로그인">
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="이메일"
            name="email"
            rules={[
              { required: true, message: '이메일을 입력해주세요.' },
              { type: 'email', message: '유효한 이메일을 입력해주세요.' },
            ]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item
            label="비밀번호"
            name="password"
            rules={[
              { required: true, message: '비밀번호를 입력해주세요.' },
            ]}
          >
            <Input.Password placeholder="비밀번호" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#999' }}>
          <p>📝 테스트 계정</p>
          <p>이메일: admin@example.com</p>
          <p>비밀번호: password123</p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
