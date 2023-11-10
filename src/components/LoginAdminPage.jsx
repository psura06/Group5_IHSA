import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message, Modal, Popover } from 'antd';
import NavBar from './NavBar';
import logo1 from '../assets/ihsalogo1.png';
import image from '../assets/login/horse login.jpg';
import { EyeOutlined, EyeInvisibleOutlined, InfoCircleOutlined, MailOutlined } from '@ant-design/icons';
import '../stylings/loginadminPage.css';

const LoginAdminPage = ({ setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [superadminUsername, setSuperadminUsername] = useState('');
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole) {
      setUserRole(userRole);
      // Redirect to the previously saved target page
      const targetPage = localStorage.getItem('targetPage');
      if (targetPage) {
        localStorage.removeItem('targetPage'); // Clear the saved target page
        navigate(targetPage);
      } else {
        navigate('/'); // Default to the home page
      }
    }
  }, [navigate, setUserRole]);

  useEffect(() => {
    // Fetch superadmin username when the component mounts
    axios.get('/api/superadmin')
      .then(response => {
        setSuperadminUsername(response.data.superadminUsername);
      })
      .catch(error => {
        console.error('Error fetching superadmin username:', error);
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      Modal.error({
        title: 'Required Fields',
        content: 'Please enter both username and password.',
      });
      return;
    }

    const loginData = {
      username: username,
      password: password,
    };

    axios
      .post('/api/login', loginData)
      .then((response) => {
        const role = response.data && response.data.role;
        if (role) {
          localStorage.setItem('role', role); // Store user role in localStorage
          setUserRole(role);
          // Redirect to the previously saved target page
          const targetPage = localStorage.getItem('targetPage');
          if (targetPage) {
            localStorage.removeItem('targetPage'); // Clear the saved target page
            navigate(targetPage);
          } else {
            navigate('/'); // Default to the home page
          }
          if (role === 'admin') {
            message.success('Admin Login Successful');
          } else if (role === 'showadmin') {
            message.success('ShowAdmin Login Successful');
          } else if (role === 'superadmin') {
            message.success('SuperAdmin Login Successful');
          }
        } else {
          if (response.status === 401) {
            message.error('Invalid credentials. Please enter correct credentials.');
          } else {
            message.error('An error occurred. Please try again later.');
          }
        }
      })
      .catch((error) => {
        console.error(error);
        message.error('Invalid credentials. Please enter correct credentials.');
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotCredentials = (e) => {
    e.preventDefault();
    // Display the modal-like message when "Forgot Username" or "Forgot Password" is clicked
    setDisplayMessage(true);
  };

  const closeModal = () => {
    // Close the modal-like message
    setDisplayMessage(false);
  };

  return (
    <div className="login-page">
      <NavBar />
      <img src={logo1} alt="logo1" className="logo1" />
      <div className="login-content">
        <div className="login-card">
          <h2>IHSA Admin Login</h2>
          <form onSubmit={handleLogin}>
            <label className="label" htmlFor="username">
              User Name
              <Popover content="Please enter a valid email address." trigger="hover">
                <InfoCircleOutlined className="info-icon" />
              </Popover>
            </label>
            <input
              id="username"
              type="text"
              className="input"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="label" htmlFor="password">
              Password
              <Popover
                content="Please enter a valid password. Password must contain at least 6 characters, one number, one uppercase letter, and one special character."
                trigger="hover"
              >
                <InfoCircleOutlined className="info-icon" />
              </Popover>
            </label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <EyeInvisibleOutlined
                  className="password-eye-icon"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <EyeOutlined className="password-eye-icon" onClick={togglePasswordVisibility} />
              )}
            </div>
            <button className="login-button" type="submit">
              LOGIN
            </button>
          </form>
          <div className="forgot-links">
            <a href="/" onClick={handleForgotCredentials}>
              Forgot Username?
            </a>
            <a href="/" onClick={handleForgotCredentials}>
              Forgot Password?
            </a>
          </div>
        </div>
        <img src={image} className="right-image" alt="Horse" />
      </div>
      <Modal
        visible={displayMessage}
        onCancel={closeModal}
        footer={null}
      >
        <div className="forgot-message">
          <MailOutlined className="email-icon" />
          <p>Contact the Administrator for Credentials</p>
          <p>Superadmin Username: {superadminUsername}</p>
        </div>
      </Modal>
      <div className="footer-card">
        <p>2023 - IHSA</p>
      </div>
    </div>
  );
};

export default LoginAdminPage;
