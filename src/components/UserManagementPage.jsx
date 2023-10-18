import React, { useState, useEffect, useCallback } from 'react';
import NavBar from './NavBar';
import axios from 'axios';
import { Table, Input, Button, Select, Modal, message, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import '../stylings/usermanagementPage.css';

const { Column } = Table;
const { Option } = Select;

const UserManagementPage = ({ userRole, loggedInUser, handleLogout }) => {
  const [admins, setAdmins] = useState([]);
  const [showAdmins, setShowAdmins] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('instruction');
  const [contactNumber, setContactNumber] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editingPassword, setEditingPassword] = useState(null);
  const [newPasswordForEditing, setNewPasswordForEditing] = useState('');

  const isValidEmail = (email) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailPattern.test(email);
  };

  const isValidPassword = (password) => {
    // At least 6 characters, one number, one uppercase letter, and one special character
    const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordPattern.test(password);
  };

  const getPasswordPopoverContent = () => (
    <div>
      <p>Password must:</p>
      <ul>
        <li>Contain at least 6 characters</li>
        <li>Include at least one number</li>
        <li>Include at least one uppercase letter</li>
        <li>Include at least one special character</li>
      </ul>
    </div>
  );

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
    if (
      !newUsername ||
      !newPassword ||
      !newRole ||
      !isValidEmail(newUsername) ||
      !isValidContactNumber(contactNumber) ||
      !isValidPassword(newPassword)
    ) {
      Modal.error({
        title: 'Invalid Fields',
        content:
          'Please fill in all the mandatory fields with valid values: Username, Password, Role, and Contact Number (10 digits only).',
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
        // Display a success message based on the role
        message.success(`User added as ${newRole}.`);
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to add the user. Please try again later.');
      });
  };

  const handleMakeAdmin = (username, unformattedContactNumber) => {
    Modal.confirm({
      title: 'Make Admin',
      content: 'Are you sure you want to make this user an admin?',
      onOk: () => {
        axios
          .put(`/api/makeAdmin/${username}`, { contact_number: unformattedContactNumber })
          .then(() => {
            message.success('User has been made an admin.');
            fetchAdmins();
            fetchShowAdmins();
          })
          .catch((err) => {
            console.error(err);
            message.error('Failed to make the user an admin. Please try again later.');
          });
      },
    });
  };

  const handleRemoveAccess = (username, role) => {
    Modal.confirm({
      title: 'Remove Access',
      content: 'Are you sure you want to remove access for this user?',
      onOk: () => {
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
            message.success('User access has been removed.');
            fetchAdmins();
            fetchShowAdmins();
          })
          .catch((err) => {
            console.error(err);
            message.error('Failed to remove user access. Please try again later.');
          });
      },
    });
  };

  const handleEditUser = () => {
    if (!editingUser) {
      return;
    }
    const { username, newUsername, contactNumber } = editingUser;
    axios
      .put(`/api/admins/${username}`, {
        newUsername,
        contact_number: contactNumber,
      })
      .then(() => {
        message.success('User information updated successfully.');
        setEditingUser(null);
        fetchAdmins();
        fetchShowAdmins();
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to update user information. Please try again later.');
      });
  };

  const handleEditPassword = (username, role) => {
    if (isValidPassword(newPasswordForEditing)) {
      axios
        .put(`/api/updatePassword/${username}`, { newPassword: newPasswordForEditing, role })
        .then(() => {
          message.success('Password updated successfully.');
          setEditingPassword(null);
        })
        .catch((err) => {
          console.error(err);
          message.error('Failed to update the password. Please try again later.');
        });
    } else {
      message.error('Invalid password. Password must meet the criteria.');
    }
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
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginLeft: 10 }}
                      onClick={() =>
                        setEditingUser({
                          username: record.username,
                          newUsername: record.username,
                          contactNumber: record.unformattedContactNumber,
                        })
                      }
                    >
                      Edit
                    </Button>
                    {userRole === 'superadmin' && (
                      <Button
                        type="primary"
                        size="small"
                        style={{ marginLeft: 10 }}
                        onClick={() => setEditingPassword(record.username)}
                      >
                        Edit Password
                      </Button>
                    )}
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
                  <Button
                    type="danger"
                    size="small"
                    style={{ marginLeft: 10 }}
                    onClick={() => handleRemoveAccess(record.username, record.role)}
                  >
                    Remove Access
                  </Button>
                  {userRole === 'superadmin' && (
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginLeft: 10 }}
                      onClick={() => setEditingPassword(record.username)}
                    >
                      Edit Password
                    </Button>
                  )}
                </span>
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
            addonAfter={
              <Popover content="Please enter a valid email address." trigger="hover">
                <InfoCircleOutlined />
              </Popover>
            }
          />
          <Input.Password
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            addonAfter={
              <Popover content={getPasswordPopoverContent()} trigger="hover">
                <InfoCircleOutlined />
              </Popover>
            }
          />
          <Input
            placeholder="Contact Number (e.g., 1234567890)"
            value={formatContactNumber(contactNumber, false)}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setContactNumber(value);
            }}
            addonAfter={
              <Popover content="Please enter a 10-digit contact number." trigger="hover">
                <InfoCircleOutlined />
              </Popover>
            }
          />
          <Select
            placeholder="Select a Role"
            value={newRole}
            onChange={(value) => setNewRole(value)}
          >
            <Option value="instruction" disabled>
              Select a Role
            </Option>
            <Option value="admin">Admin</Option>
            <Option value="showadmin">Show Admin</Option>
          </Select>
          <Button type="primary" className="create-user-button" onClick={handleUserCreation}>
            Create User
          </Button>
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal
        title="Edit User Information"
        visible={!!editingUser}
        onOk={handleEditUser}
        onCancel={() => setEditingUser(null)}
      >
        {editingUser && (
          <div>
            <Input
              placeholder="New Username"
              value={editingUser.newUsername}
              onChange={(e) =>
                setEditingUser({ ...editingUser, newUsername: e.target.value })
              }
            />
            <Input
              placeholder="New Contact Number"
              value={editingUser.contactNumber}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  contactNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                })
              }
            />
          </div>
        )}
      </Modal>

      {/* Edit Password Modal */}
      <Modal
        title="Edit Password"
        visible={!!editingPassword}
        onOk={() => handleEditPassword(editingPassword, 'admin')}
        onCancel={() => {
          setEditingPassword(null);
          setNewPasswordForEditing('');
        }}
      >
        {editingPassword && (
          <div>
            <Input.Password
              placeholder="New Password"
              value={newPasswordForEditing}
              onChange={(e) => setNewPasswordForEditing(e.target.value)}
              addonAfter={
                <Popover content={getPasswordPopoverContent()} trigger="hover">
                  <InfoCircleOutlined />
                </Popover>
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagementPage;
