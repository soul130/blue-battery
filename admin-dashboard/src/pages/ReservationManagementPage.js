import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  message,
  Space,
  Tag,
  DatePicker,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { setReservations, updateReservation, setLoading } from '../redux/slices/reservationSlice';
import { adminAPI } from '../services/adminAPI';

const ReservationManagementPage = () => {
  const dispatch = useDispatch();
  const { reservations, isLoading } = useSelector((state) => state.reservation);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async (status = null, startDate = null, endDate = null) => {
    dispatch(setLoading(true));
    try {
      const response = await adminAPI.getReservations(status, startDate, endDate);
      dispatch(setReservations(response.data));
    } catch (error) {
      message.error('예약 목록 불러오기 실패');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditReservation = (reservation) => {
    setEditingReservation(reservation);
    form.setFieldsValue({
      status: reservation.status,
      notes: reservation.notes || '',
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await adminAPI.updateReservation(editingReservation._id, values);
      dispatch(updateReservation({ ...editingReservation, ...values }));
      message.success('예약이 수정되었습니다.');
      setModalVisible(false);
    } catch (error) {
      message.error('수정 실패');
    }
  };

  const statusMap = {
    pending: { color: 'orange', text: '대기중' },
    confirmed: { color: 'green', text: '확정' },
    completed: { color: 'blue', text: '완료' },
    cancelled: { color: 'red', text: '취소' },
  };

  const columns = [
    {
      title: '예약자',
      key: 'userName',
      render: (_, record) => record.userId?.name || 'N/A',
    },
    {
      title: '배터리',
      key: 'batteryName',
      render: (_, record) => record.batteryId?.name || 'N/A',
    },
    {
      title: '예약 날짜',
      key: 'date',
      render: (_, record) =>
        new Date(record.reservationDate).toLocaleDateString('ko-KR'),
    },
    {
      title: '시간',
      dataIndex: 'timeSlot',
      key: 'timeSlot',
    },
    {
      title: '위치',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const s = statusMap[status];
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEditReservation(record)}
        >
          수정
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card title="예약 관리">
        <div style={{ marginBottom: 16 }}>
          <Space>
            <DatePicker.RangePicker
              onChange={(dates) => setDateRange(dates)}
              format="YYYY-MM-DD"
            />
            <Button
              type="primary"
              onClick={() =>
                fetchReservations(
                  null,
                  dateRange[0]?.format('YYYY-MM-DD'),
                  dateRange[1]?.format('YYYY-MM-DD')
                )
              }
            >
              조회
            </Button>
            <Button onClick={() => fetchReservations()}>
              초기화
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={reservations}
          loading={isLoading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="예약 수정"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="예약 상태"
            name="status"
            rules={[{ required: true, message: '상태를 선택해주세요.' }]}
          >
            <Select>
              <Select.Option value="pending">대기중</Select.Option>
              <Select.Option value="confirmed">확정</Select.Option>
              <Select.Option value="completed">완료</Select.Option>
              <Select.Option value="cancelled">취소</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="메모" name="notes">
            <Input.TextArea placeholder="기술자 지정, 추가 요청 등" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReservationManagementPage;
