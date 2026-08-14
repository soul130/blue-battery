import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Space, Tag, Spin } from 'antd';
import { DashboardOutlined, ShoppingOutlined, CalendarOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { adminAPI } from '../services/adminAPI';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('대시보드 데이터 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  const statusMap = {
    pending: { color: 'orange', text: '대기중' },
    confirmed: { color: 'green', text: '확정' },
    completed: { color: 'blue', text: '완료' },
    cancelled: { color: 'red', text: '취소' },
  };

  return (
    <div>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 사용자 수"
              value={summary?.totalUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 예약 수"
              value={summary?.totalReservations || 0}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="배터리 상품 수"
              value={summary?.totalBatteries || 0}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 매출"
              value={summary?.totalRevenue || 0}
              prefix={<DollarOutlined />}
              suffix="원"
              valueStyle={{ fontSize: 18, color: '#1E88E5' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="예약 현황" bordered={false}>
            <Row gutter={16}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="대기중"
                  value={summary?.pendingReservations || 0}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="확정"
                  value={summary?.confirmedReservations || 0}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="완료"
                  value={summary?.completedReservations || 0}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="취소"
                  value={summary?.cancelledReservations || 0}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="매출 요약" bordered={false}>
            <Statistic
              title="오늘 매출"
              value={summary?.totalRevenue || 0}
              suffix="원"
              valueStyle={{ fontSize: 24, color: '#1E88E5' }}
            />
            <p style={{ marginTop: 20, color: '#999' }}>
              📊 상세 통계는 통계 페이지에서 확인할 수 있습니다.
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
