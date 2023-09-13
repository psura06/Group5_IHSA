import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import logo1 from '../assets/ihsalogo1.png';
import image from '../assets/login/horse login.jpg';
import '../stylings/loginadminPage.css';

const LoginAdminPage = ({ setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

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
          navigate('/');
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
    </div>
  );
};

export default LoginAdminPage;
