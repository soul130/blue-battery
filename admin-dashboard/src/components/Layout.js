import React from 'react';
import { Layout as AntLayout, Menu, Button, Dropdown, Space } from 'antd';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  DashboardOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = AntLayout;

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">대시보드</Link>,
    },
    {
      key: '/batteries',
      icon: <ShoppingOutlined />,
      label: <Link to="/batteries">배터리 관리</Link>,
    },
    {
      key: '/reservations',
      icon: <CalendarOutlined />,
      label: <Link to="/reservations">예약 관리</Link>,
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: <Link to="/users">사용자 관리</Link>,
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: <Link to="/statistics">통계</Link>,
    },
  ];

  const userMenu = {
    items: [
      {
        key: '1',
        label: admin?.name || '관리자',
        disabled: true,
      },
      {
        type: 'divider',
      },
      {
        key: '2',
        label: '로그아웃',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>
          <h2>🔵 블루배터리</h2>
          <p>관리자 대시보드</p>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/dashboard']}
          items={menuItems}
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 style={{ margin: 0 }}>블루배터리 관리자 대시보드</h2>
          <Dropdown menu={userMenu}>
            <Button type="text" size="large">
              👤 {admin?.name || '관리자'}
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px', padding: '24px', background: '#f0f2f5' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
