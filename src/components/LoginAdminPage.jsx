import React from 'react';
import '../loginadminPage.css';
import logo from '../assets/ihsalogo.png'; // replace this with your actual logo path
import image from '../assets/horse login.jpg'; // replace this with your actual image path

const LoginPage = () => {
  return (
    <div className="login-page">
      <img src={logo} alt="logo" className="logo"/>
      <div className="login-card">
        <h2>IHSA Admin Login</h2>
        <label for="username">User Name</label>
        <input id="username" type="text" placeholder="User Name"/>
        <label for="password">Password</label>
        <input id="password" type="password" placeholder="Password"/>
        <button className="login-button">LOGIN</button>
        <div className="forgot-links">
          <a href="#">Forgot Username?</a>
          <a href="#">Forgot Password?</a>
        </div>
      </div>
      <img src={image} alt="image" className="right-image"/>
      <div className="footer-card">
        <p>2023 - IHSA</p>
      </div>
    </div>
  );
};

export default LoginPage;
