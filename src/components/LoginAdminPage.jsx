import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import logo1 from '../assets/ihsalogo1.png';
import image from '../assets/login/horse login.jpg';
import { Modal } from 'antd'; // Import Modal
import '../stylings/loginadminPage.css';

const LoginAdminPage = ({ setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // State variables for controlling modals
  const [invalidCredentialsModal, setInvalidCredentialsModal] = useState(false);
  const [emptyFieldsModal, setEmptyFieldsModal] = useState(false);
  const [loginSuccessModal, setLoginSuccessModal] = useState(false);

  // Function to open and close modals
  const showInvalidCredentialsModal = () => {
    setInvalidCredentialsModal(true);
  };

  const showEmptyFieldsModal = () => {
    setEmptyFieldsModal(true);
  };

  const showLoginSuccessModal = () => {
    setLoginSuccessModal(true);
  };

  const closeModals = () => {
    setInvalidCredentialsModal(false);
    setEmptyFieldsModal(false);
    setLoginSuccessModal(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      showEmptyFieldsModal();
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
          localStorage.setItem('role', role);
          setUserRole(role);
          showLoginSuccessModal();
          navigate('/');
        } else {
          showInvalidCredentialsModal();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="login-page">
      <NavBar />
      <img src={logo1} alt="logo1" className="logo1" />
      <div className="login-content">
        <div className="login-card">
          <h2>IHSA Admin Login</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="username">User Name</label>
            <input
              id="username"
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-button" type="submit">
              LOGIN
            </button>
          </form>
          <div className="forgot-links">
            <a href="/">Forgot Username?</a>
            <a href="/">Forgot Password?</a>
          </div>
        </div>
        <img src={image} className="right-image" alt="Horse" />
      </div>
      <div className="footer-card">
        <p>2023 - IHSA</p>
      </div>

      {/* Modals */}
      <Modal
        title="Invalid Username or Password"
        visible={invalidCredentialsModal}
        onOk={closeModals}
        onCancel={closeModals}
        okText="OK"
      >
        Please check your username and password.
      </Modal>

      <Modal
        title="Empty Fields"
        visible={emptyFieldsModal}
        onOk={closeModals}
        onCancel={closeModals}
        okText="OK"
      >
        Please fill in both the username and password fields.
      </Modal>

      <Modal
        title="Login Successful"
        visible={loginSuccessModal}
        onOk={closeModals}
        onCancel={closeModals}
        okText="OK"
      >
        You have successfully logged in.
      </Modal>
    </div>
  );
};

export default LoginAdminPage;
