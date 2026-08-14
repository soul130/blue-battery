import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Space,
  Popconfirm,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setBatteries, addBattery, updateBattery, removeBattery, setError } from '../redux/slices/batterySlice';
import { adminAPI } from '../services/adminAPI';

const BatteryManagementPage = () => {
  const dispatch = useDispatch();
  const { batteries, isLoading } = useSelector((state) => state.battery);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBattery, setEditingBattery] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBatteries();
  }, []);

  const fetchBatteries = async () => {
    try {
      const response = await adminAPI.getBatteries();
      dispatch(setBatteries(response.data));
    } catch (error) {
      message.error('배터리 목록 불러오기 실패');
    }
  };

  const handleAddBattery = () => {
    setEditingBattery(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditBattery = (battery) => {
    setEditingBattery(battery);
    form.setFieldsValue({
      name: battery.name,
      model: battery.model,
      description: battery.description,
      price: battery.price,
      stock: battery.stock,
      category: battery.category,
      capacity: battery.specifications?.capacity,
      voltage: battery.specifications?.voltage,
      warranty: battery.specifications?.warranty,
    });
    setModalVisible(true);
  };

  const handleDeleteBattery = async (id) => {
    try {
      await adminAPI.deleteBattery(id);
      dispatch(removeBattery(id));
      message.success('배터리가 삭제되었습니다.');
    } catch (error) {
      message.error('배터리 삭제 실패');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        specifications: {
          capacity: values.capacity,
          voltage: values.voltage,
          warranty: values.warranty,
        },
      };
      delete data.capacity;
      delete data.voltage;
      delete data.warranty;

      if (editingBattery) {
        await adminAPI.updateBattery(editingBattery._id, data);
        dispatch(updateBattery({ ...editingBattery, ...data }));
        message.success('배터리 정보가 수정되었습니다.');
      } else {
        const response = await adminAPI.addBattery(data);
        dispatch(addBattery(response.data.battery));
        message.success('배터리가 추가되었습니다.');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('저장 실패');
    }
  };

  const columns = [
    {
      title: '상품명',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '모델',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '가격',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₩${price.toLocaleString()}`,
    },
    {
      title: '용량',
      key: 'capacity',
      render: (_, record) => record.specifications?.capacity || 'N/A',
    },
    {
      title: '재고',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>
          {stock > 0 ? `${stock}개` : '없음'}
        </Tag>
      ),
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        let color = 'blue';
        if (category === 'premium') color = 'gold';
        if (category === 'professional') color = 'purple';
        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditBattery(record)}
          >
            수정
          </Button>
          <Popconfirm
            title="삭제 확인"
            description="이 배터리를 삭제하시겠습니까?"
            onConfirm={() => handleDeleteBattery(record._id)}
            okText="삭제"
            cancelText="취소"
          >
            <Button type="danger" size="small" icon={<DeleteOutlined />}>
              삭제
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="배터리 관리"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddBattery}
          >
            배터리 추가
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={batteries}
          loading={isLoading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingBattery ? '배터리 수정' : '배터리 추가'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="상품명"
            name="name"
            rules={[{ required: true, message: '상품명을 입력해주세요.' }]}
          >
            <Input placeholder="예: 삼성 배터리 Pro" />
          </Form.Item>

          <Form.Item
            label="모델"
            name="model"
            rules={[{ required: true, message: '모델을 입력해주세요.' }]}
          >
            <Input placeholder="예: SA-100" />
          </Form.Item>

          <Form.Item
            label="설명"
            name="description"
            rules={[{ required: true, message: '설명을 입력해주세요.' }]}
          >
            <Input.TextArea placeholder="배터리 설명" rows={3} />
          </Form.Item>

          <Form.Item
            label="가격"
            name="price"
            rules={[{ required: true, message: '가격을 입력해주세요.' }]}
          >
            <InputNumber prefix="₩" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="재고"
            name="stock"
            rules={[{ required: true, message: '재고를 입력해주세요.' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="카테고리"
            name="category"
            rules={[{ required: true, message: '카테고리를 선택해주세요.' }]}
          >
            <Select>
              <Select.Option value="standard">표준형</Select.Option>
              <Select.Option value="premium">프리미엄</Select.Option>
              <Select.Option value="professional">프로페셔널</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="용량"
            name="capacity"
            rules={[{ required: true, message: '용량을 입력해주세요.' }]}
          >
            <Input placeholder="예: 90Ah" />
          </Form.Item>

          <Form.Item
            label="전압"
            name="voltage"
            rules={[{ required: true, message: '전압을 입력해주세요.' }]}
          >
            <Input placeholder="예: 12V" />
          </Form.Item>

          <Form.Item
            label="보증기간"
            name="warranty"
            rules={[{ required: true, message: '보증기간을 입력해주세요.' }]}
          >
            <Input placeholder="예: 5년" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BatteryManagementPage;
