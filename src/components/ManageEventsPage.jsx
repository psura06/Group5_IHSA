import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm } from 'antd';
import axios from 'axios';
import NavBar from './NavBar';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment-timezone';

const { Option } = Select;

const ManageEventsPage = ({ userRole, handleLogout }) => {
  const [events, setEvents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = useCallback(async () => { // Wrap fetchEvents with useCallback
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data.map(formatEventDates));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []); // Empty dependency array because fetchEvents doesn't depend on any props or state

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  

  const formatEventDates = (event) => {
    // Format start_date and end_date
    event.start_date = moment(event.start_date).format('YYYY-MM-DD');
    event.end_date = moment(event.end_date).format('YYYY-MM-DD');
    // Format start_time and end_time
    event.start_time = moment(event.start_time, 'HH:mm:ss').format('HH:mm');
    event.end_time = moment(event.end_time, 'HH:mm:ss').format('HH:mm');
    return event;
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => <img src={text} alt={`Event ${record.name}`} style={{ width: '50px', height: '50px' }} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Venue',
      dataIndex: 'venue',
      key: 'venue',
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'Zone',
      dataIndex: 'zone',
      key: 'zone',
    },
    {
      title: 'Discipline',
      dataIndex: 'discipline',
      key: 'discipline',
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
    },
    {
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
    },
    {
      title: 'End Time',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: 'Time Zone',
      dataIndex: 'time_zone',
      key: 'time_zone',
    },
    {
      title: 'Gallery',
      dataIndex: 'gallery',
      key: 'gallery',
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
            title="Are you sure you want to delete this event?"
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
    setEditingEvent(null);
    form.resetFields();
  };

  const handleEdit = (event) => {
    setVisible(true);
    setEditingEvent(event);
    form.setFieldsValue(event);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      // Format date and time values before sending them to the server
      values.start_date = moment(values.start_date).format('YYYY-MM-DD');
      values.end_date = moment(values.end_date).format('YYYY-MM-DD');
      values.start_time = moment(values.start_time, 'HH:mm').format('HH:mm:ss');
      values.end_time = moment(values.end_time, 'HH:mm').format('HH:mm:ss');

      if (editingEvent) {
        // Edit existing event
        await axios.put(`/api/events/${editingEvent.id}`, values);
      } else {
        // Create a new event
        await axios.post('/api/events', values);
      }
      fetchEvents();
      form.resetFields();
      setVisible(false);
    } catch (error) {
      console.error('Error creating/editing event:', error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div>
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <div style={{ padding: '20px' }}>
        <Button type="primary" onClick={showModal} style={{ marginBottom: 16, marginTop: 16 }}>
          Create Event
        </Button>
        <Table dataSource={events} columns={columns} rowKey="id" />
        <Modal
          title={editingEvent ? 'Edit Event' : 'Create Event'}
          visible={visible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} name="createEventForm" onFinish={onFinish}>
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please enter the image URL' }]}
            >
              <Input placeholder="Enter image URL" />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter the event name' }]}
            >
              <Input placeholder="Enter event name" />
            </Form.Item>
            <Form.Item label="Venue" name="venue" rules={[{ required: true, message: 'Please enter the venue' }]}>
              <Input placeholder="Enter venue" />
            </Form.Item>
            <Form.Item
              label="Region"
              name="region"
              rules={[{ required: true, message: 'Please select a region' }]}
            >
              <Select placeholder="Select region">
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Zone"
              name="zone"
              rules={[{ required: true, message: 'Please select a zone' }]}
            >
              <Select placeholder="Select zone">
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
                <Option value="6">6</Option>
                <Option value="7">7</Option>
                <Option value="8">8</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Discipline"
              name="discipline"
              rules={[{ required: true, message: 'Please select a discipline' }]}
            >
              <Select placeholder="Select discipline">
                <Option value="Hunter Seat">Hunter Seat</Option>
                <Option value="Western Seat">Western Seat</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Description" name="description"
            rules={[{ required: true, message: 'Please enter the description' }]}>
            <Input.TextArea placeholder="Description" />
          </Form.Item>
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[{ required: true, message: 'Please select a start date' }]}
            >
              <DateTime dateFormat="YYYY-MM-DD" timeFormat={false} />
            </Form.Item>
            <Form.Item
              label="Start Time"
              name="start_time"
              rules={[{ required: true, message: 'Please select a start time' }]}
            >
              <DateTime dateFormat={false} timeFormat="HH:mm" />
            </Form.Item>
            <Form.Item
              label="End Date"
              name="end_date"
              rules={[{ required: true, message: 'Please select an end date' }]}
            >
              <DateTime dateFormat="YYYY-MM-DD" timeFormat={false} />
            </Form.Item>
            <Form.Item
              label="End Time"
              name="end_time"
              rules={[{ required: true, message: 'Please select an end time' }]}
            >
              <DateTime dateFormat={false} timeFormat="HH:mm" />
            </Form.Item>
            <Form.Item
              label="Time Zone"
              name="time_zone"
              rules={[{ required: true, message: 'Please select a time zone' }]}
            >
              <Select placeholder="Select time zone">
                <Option value="Pacific Standard Time">Pacific Standard Time</Option>
                <Option value="Mountain Standard Time">Mountain Standard Time</Option>
                <Option value="Central Standard Time">Central Standard Time</Option>
                <Option value="Eastern Standard Time">Eastern Standard Time</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Gallery"
              name="gallery"
            >
              <Input placeholder="Enter Gallery Link" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingEvent ? 'Save' : 'Create'}
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

export default ManageEventsPage;
