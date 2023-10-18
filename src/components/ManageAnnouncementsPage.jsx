import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm , message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import NavBar from './NavBar';

const ManageAnnouncementsPage = ({ userRole, handleLogout }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const showSuccessMessage = (text) => {
    message.success(text);
  };

  const showErrorMessage = (text) => {
    message.error(text);
  };

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('MM/DD/YYYY'),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => moment(time, 'HH:mm:ss').format('hh:mm:ss A'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this announcement?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setVisible(true);
    setEditingAnnouncement(null);
    form.resetFields();
  };

  const handleEdit = (announcement) => {
    setVisible(true);
    setEditingAnnouncement(announcement);
    form.setFieldsValue(announcement);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
        if (editingAnnouncement) {
            await axios.put(`/api/announcements/${editingAnnouncement.id}`, values);
            showSuccessMessage('Announcement updated successfully');
          } else {
            await axios.post('/api/announcements', values);
            showSuccessMessage('Announcement created successfully');
          }
          fetchAnnouncements();
          form.resetFields();
          setVisible(false);
        } catch (error) {
          showErrorMessage('Error creating/editing announcement');
          console.error('Error creating/editing announcement:', error);
        }
      };

      const handleDelete = async (announcementId) => {
        try {
          await axios.delete(`/api/announcements/${announcementId}`);
          fetchAnnouncements();
          showSuccessMessage('Announcement deleted successfully'); // Display success message
        } catch (error) {
          console.error('Error deleting announcement:', error);
        }
      };      

  return (
    <div>
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <div style={{ padding: '20px' }}>
        <Button type="primary" onClick={showModal} style={{ marginBottom: 16, marginTop: 16 }}>
          Create Announcement
        </Button>
        <Table dataSource={announcements} columns={columns} rowKey="id" />
        <Modal
          title={editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
          visible={visible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} name="createAnnouncementForm" onFinish={onFinish}>
            <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter the title' }]}>
              <Input placeholder="Enter title" />
            </Form.Item>
            <Form.Item label="Content" name="content" rules={[{ required: true, message: 'Please enter the content' }]}>
              <Input.TextArea placeholder="Content" />
            </Form.Item>
            <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please enter the date' }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item label="Time" name="time" rules={[{ required: true, message: 'Please enter the time' }]}>
              <Input type="time" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingAnnouncement ? 'Save' : 'Create'}
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageAnnouncementsPage;
