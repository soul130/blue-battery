import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Select, message, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, updateUser, setLoading } from '../redux/slices/userSlice';
import { adminAPI } from '../services/adminAPI';

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    dispatch(setLoading(true));
    try {
      const response = await adminAPI.getUsers();
      dispatch(setUsers(response.data));
    } catch (error) {
      message.error('사용자 목록 불러오기 실패');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      role: user.role,
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await adminAPI.updateUserRole(editingUser._id, values.role);
      dispatch(updateUser({ ...editingUser, ...values }));
      message.success('사용자 역할이 변경되었습니다.');
      setModalVisible(false);
    } catch (error) {
      message.error('변경 실패');
    }
  };

  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '전화번호',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '역할',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '관리자' : '사용자'}
        </Tag>
      ),
    },
    {
      title: '가입 날짜',
      key: 'createdAt',
      render: (_, record) =>
        new Date(record.createdAt).toLocaleDateString('ko-KR'),
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEditUser(record)}
        >
          역할 변경
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card title="사용자 관리">
        <Table
          columns={columns}
          dataSource={users}
          loading={isLoading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="사용자 역할 변경"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <div style={{ marginBottom: 16 }}>
            <strong>{editingUser?.name}</strong> ({editingUser?.email})
          </div>
          <Form.Item
            label="역할"
            name="role"
            rules={[{ required: true, message: '역할을 선택해주세요.' }]}
          >
            <Select>
              <Select.Option value="user">일반 사용자</Select.Option>
              <Select.Option value="admin">관리자</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
