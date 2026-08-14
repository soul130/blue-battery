import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Select, Button, Spin, Statistic } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { adminAPI } from '../services/adminAPI';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsPage = () => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchRevenue();
  }, [period]);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      let startDate = null;
      let endDate = dayjs().format('YYYY-MM-DD');

      if (period === 'week') {
        startDate = dayjs().subtract(7, 'days').format('YYYY-MM-DD');
      } else if (period === 'month') {
        startDate = dayjs().subtract(30, 'days').format('YYYY-MM-DD');
      } else if (period === 'year') {
        startDate = dayjs().subtract(365, 'days').format('YYYY-MM-DD');
      }

      const response = await adminAPI.getRevenue(startDate, endDate);
      setRevenue(response.data);
    } catch (error) {
      console.error('매출 데이터 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = revenue ? {
    labels: [
      Object.keys(revenue.paymentMethodStats).map(key => {
        if (key === 'credit_card') return '신용카드';
        if (key === 'kakao_pay') return '카카오페이';
        if (key === 'toss') return '토스';
        return key;
      }),
    ].flat(),
    datasets: [
      {
        label: '결제 수단별 금액',
        data: Object.values(revenue.paymentMethodStats).map(s => s.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <Card
        title="매출 통계"
        extra={
          <Select
            value={period}
            onChange={setPeriod}
            style={{ width: 150 }}
          >
            <Select.Option value="week">최근 7일</Select.Option>
            <Select.Option value="month">최근 30일</Select.Option>
            <Select.Option value="year">최근 1년</Select.Option>
          </Select>
        }
      >
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={8}>
            <Statistic
              title="총 매출"
              value={revenue?.totalRevenue || 0}
              prefix={<DollarOutlined />}
              suffix="원"
              valueStyle={{ fontSize: 24, color: '#1E88E5' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Statistic
              title="총 거래 건수"
              value={revenue?.totalPayments || 0}
              suffix="건"
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Statistic
              title="평균 거래액"
              value={revenue?.totalPayments > 0 ? Math.round(revenue.totalRevenue / revenue.totalPayments) : 0}
              suffix="원"
            />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card title="결제 수단별 현황" bordered={false}>
              {revenue && Object.entries(revenue.paymentMethodStats).map(([method, stats]) => {
                let methodName = method;
                if (method === 'credit_card') methodName = '신용카드';
                if (method === 'kakao_pay') methodName = '카카오페이';
                if (method === 'toss') methodName = '토스';

                return (
                  <Row key={method} style={{ marginBottom: 16, padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Col xs={12}>
                      <strong>{methodName}</strong>
                    </Col>
                    <Col xs={12} style={{ textAlign: 'right' }}>
                      <div>{stats.count}건 / ₩{stats.amount.toLocaleString()}</div>
                    </Col>
                  </Row>
                );
              })}
            </Card>
          </Col>
          {pieChartData && (
            <Col xs={24} lg={12}>
              <Card title="결제 수단별 비율" bordered={false}>
                <Pie data={pieChartData} options={{ responsive: true }} />
              </Card>
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default StatisticsPage;
