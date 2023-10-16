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

  const isValidEmail = (email) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    return emailPattern.test(email);
  };

  const fetchAdmins = useCallback(async () => {
    const res = await axios.get('/api/admins');
    const dataWithIds = res.data
      .filter((admin) => admin.username !== loggedInUser)
      .map((admin, index) => ({ ...admin, role: 'admin', id: index + 1 }));
    setAdmins(dataWithIds);
  }, [loggedInUser]);

  const fetchShowAdmins = useCallback(async () => {
    const res = await axios.get('/api/showadmins');
    const dataWithIds = res.data
      .map((admin, index) => ({ ...admin, role: 'showadmin', id: index + 1 }));
    setShowAdmins(dataWithIds);
  }, []);

  const handleUserCreation = () => {
    if (!newUsername || !newPassword || !newRole || !isValidEmail(newUsername)) {
      Modal.error({
        title: 'Invalid Email',
        content: 'Please enter a valid Gmail email address as the username.',
      });
      return;
    }

    axios
      .post('/api/createUser', { username: newUsername, password: newPassword, role: newRole })
      .then(() => {
        setNewUsername('');
        setNewPassword('');
        setNewRole('');
        fetchAdmins();
        fetchShowAdmins();
      })
      .catch((err) => console.error(err));
  };

  const handleMakeAdmin = (username) => {
    axios
      .put(`/api/makeAdmin/${username}`)
      .then(() => {
        fetchAdmins();
        fetchShowAdmins();
      })
      .catch((err) => console.error(err));
  };
  

  const handleRemoveAccess = (username, role) => {
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
            title="Action"
            key="action"
            render={(text, record) => (
              <strong>
                {record.username !== loggedInUser && (
                  <span>
                    <Button
                      type="danger"
                      size="small"
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
            title="Action"
            key="action"
            render={(text, record) => (
              <strong>
                <span>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleMakeAdmin(record.username)}
                  >
                    Make Admin
                  </Button>
                </span>
                {record.username !== loggedInUser && (
                  <span>
                    <Button
                      type="danger"
                      size="small"
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
            placeholder="Username (Gmail Email)"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
    </div>
  );
};

export default UserManagementPage;

