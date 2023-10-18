import React, { useState, useEffect, useCallback } from 'react';
import NavBar from './NavBar';
import axios from 'axios';
import { Table, Input, Button, Select, Modal } from 'antd';
import '../stylings/usermanagementPage.css';

const { Column } = Table;
const { Option } = Select;

const UserManagementPage = ({ userRole, loggedInUser, handleLogout }) => {
  const [admins, setAdmins] = useState([]);
  const [showAdmins, setShowAdmins] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const [confirmRemoveAccess, setConfirmRemoveAccess] = useState(false);
  const [confirmMakeAdmin, setConfirmMakeAdmin] = useState(false);

  const isValidEmail = (email) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailPattern.test(email);
  };

  const isValidContactNumber = (number) => {
    const contactNumberPattern = /^\d{10}$/;
    return contactNumberPattern.test(number);
  };

  const formatContactNumber = (number, shouldFormat = true) => {
    if (!shouldFormat) {
      return number;
    }
    return `(${number.slice(0, 3)})-${number.slice(3, 6)}-${number.slice(6)}`;
  };

  const fetchAdmins = useCallback(async () => {
    const res = await axios.get('/api/admins');
    const dataWithIds = res.data
      .filter((admin) => admin.username !== loggedInUser)
      .map((admin, index) => ({
        ...admin,
        role: 'admin',
        id: index + 1,
        unformattedContactNumber: admin.contact_number,
        contactNumber: formatContactNumber(admin.contact_number),
      }));
    setAdmins(dataWithIds);
  }, [loggedInUser]);

  const fetchShowAdmins = useCallback(async () => {
    const res = await axios.get('/api/showadmins');
    const dataWithIds = res.data
      .map((admin, index) => ({
        ...admin,
        role: 'showadmin',
        id: index + 1,
        unformattedContactNumber: admin.contact_number,
        contactNumber: formatContactNumber(admin.contact_number),
      }));
    setShowAdmins(dataWithIds);
  }, []);

  const handleUserCreation = () => {
    if (!newUsername || !newPassword || !newRole || !isValidEmail(newUsername) || !isValidContactNumber(contactNumber)) {
      Modal.error({
        title: 'Invalid Fields',
        content: 'Please fill in all the mandatory fields with valid values: Username, Password, Role, and Contact Number (10 digits only).',
      });
      return;
    }

    axios
      .post('/api/createUser', {
        username: newUsername,
        password: newPassword,
        role: newRole,
        contact_number: contactNumber,
      })
      .then(() => {
        setNewUsername('');
        setNewPassword('');
        setNewRole('');
        setContactNumber('');
        fetchAdmins();
        fetchShowAdmins();
        showModal(
          newRole === 'showadmin'
            ? 'User account has been created as show admin.'
            : 'User account has been created as admin.'
        );
      })
      .catch((err) => console.error(err));
  };

  const handleMakeAdmin = (username, unformattedContactNumber) => {
    setConfirmMakeAdmin({
      visible: true,
      username,
      unformattedContactNumber,
    });
  };

  const handleRemoveAccess = (username, role) => {
    setConfirmRemoveAccess({
      visible: true,
      username,
      role,
    });
  };

  const showModal = (text) => {
    Modal.info({
      title: 'Notification',
      content: text,
    });
  };

  const confirmMakeAdminAction = () => {
    const { username, unformattedContactNumber } = confirmMakeAdmin;
    axios
      .put(`/api/makeAdmin/${username}`, { contact_number: unformattedContactNumber })
      .then(() => {
        fetchAdmins();
        fetchShowAdmins();
        showModal('Now user is admin.');
        setConfirmMakeAdmin(false);
      })
      .catch((err) => console.error(err));
  };

  const confirmRemoveAccessAction = () => {
    const { username, role } = confirmRemoveAccess;
    let endpoint;
    switch (role) {
      case 'admin':
        endpoint = `/api/removeAdmin/${username}`;
        break;
      case 'showadmin':
        endpoint = `/api/removeShowAdmin/${username}`;
        break;
      default:
        console.error(`Invalid role: ${role}`);
        return;
    }

    axios
      .put(endpoint)
      .then(() => {
        fetchAdmins();
        fetchShowAdmins();
        showModal('Access has been removed.');
        setConfirmRemoveAccess(false);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAdmins();
    fetchShowAdmins();
  }, [fetchAdmins, fetchShowAdmins, loggedInUser]);

  return (
    <div className="user-management-page">
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <div className="table-container">
        <h1 className="table-title">Admin Users</h1>
        <Table dataSource={admins} rowKey="id" pagination={{ pageSize: 5 }}>
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="Username" dataIndex="username" key="username" />
          <Column
            title="Contact Number"
            dataIndex="unformattedContactNumber"
            key="contactNumber"
            render={(text, record) => formatContactNumber(record.unformattedContactNumber)}
          />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <strong>
                {record.username !== loggedInUser && (
                  <span>
                    <Button
                      type="danger"
                      size="small"
                      style={{ backgroundColor: 'red', color: 'white' }}
                      onClick={() => handleRemoveAccess(record.username, record.role)}
                    >
                      Remove Access
                    </Button>
                  </span>
                )}
              </strong>
            )}
          />
        </Table>
      </div>
      <div className="table-container">
        <h1 className="table-title">Show Admin Users</h1>
        <Table dataSource={showAdmins} rowKey="id" pagination={{ pageSize: 5 }}>
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="Username" dataIndex="username" key="username" />
          <Column
            title="Contact Number"
            dataIndex="unformattedContactNumber"
            key="contactNumber"
            render={(text, record) => formatContactNumber(record.unformattedContactNumber)}
          />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <strong>
                <span>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleMakeAdmin(record.username, record.unformattedContactNumber)}
                  >
                    Make Admin
                  </Button>
                </span>
                {record.username !== loggedInUser && (
                  <span>
                    <Button
                      type="danger"
                      size="small"
                      style={{ backgroundColor: 'red', color: 'white' }}
                      onClick={() => handleRemoveAccess(record.username, record.role)}
                    >
                      Remove Access
                    </Button>
                  </span>
                )}
              </strong>
            )}
          />
        </Table>
      </div>
      <div className="add-user-container">
        <h1 className="form-title">Add User</h1>
        <div className="add-user-form">
          <Input
            placeholder="Username (Email)"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Input.Password
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            placeholder="Contact Number (e.g., 1234567890)"
            value={formatContactNumber(contactNumber, false)}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setContactNumber(value);
            }}
          />
          <Select
            placeholder="Role"
            value={newRole}
            onChange={(value) => setNewRole(value)}
          >
            <Option value="admin">Admin</Option>
            <Option value="showadmin">Show Admin</Option>
          </Select>
          <Button type="primary" className="create-user-button" onClick={handleUserCreation}>
            Create User
          </Button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <Modal
        title="Confirm Make Admin"
        visible={confirmMakeAdmin}
        onOk={confirmMakeAdminAction}
        onCancel={() => setConfirmMakeAdmin(false)}
        okText="Make Admin"
        cancelText="Cancel"
      >
        Are you sure you want to make this user an admin?
      </Modal>

      <Modal
        title="Confirm Remove Access"
        visible={confirmRemoveAccess}
        onOk={confirmRemoveAccessAction}
        onCancel={() => setConfirmRemoveAccess(false)}
        okText="Remove Access"
        cancelText="Cancel"
      >
        Are you sure you want to remove access for this user?
      </Modal>
    </div>
  );
};

export default UserManagementPage;
