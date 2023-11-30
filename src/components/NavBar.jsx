import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiHomeFill, RiMapPin2Fill, RiImageFill, RiUserFill, RiCalendarTodoFill, RiUserSearchFill, RiLogoutBoxFill } from 'react-icons/ri';
import { GiHorseHead } from 'react-icons/gi';
import { FaUserFriends } from 'react-icons/fa';
import { BsFillChatQuoteFill } from 'react-icons/bs';
import { BiShuffle } from 'react-icons/bi';
import logo from '../assets/ihsalogo.png';
import '../stylings/navbar.css';
import { Modal, message } from 'antd';

const iconStyle = {
  fontSize: '20px',
};

const linkStyle = {
  fontSize: '12px',
};

const NavBar = ({ userRole, handleLogout }) => {
  const isAdmin = userRole === 'admin';
  const isShowAdmin = userRole === 'showadmin';
  const isSuperAdmin = userRole === 'superadmin';

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    handleLogout();
    message.success('Logout successful');
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo-link">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <div className="menu-container">
        <ul className="menu">
          <li>
            <Link to="/" style={linkStyle}>
              <RiHomeFill style={iconStyle} /> Home
            </Link>
          </li>
          <li>
            <Link to="/map" style={linkStyle}>
              <RiMapPin2Fill style={iconStyle} /> Map
            </Link>
          </li>
          {(isAdmin || isShowAdmin || isSuperAdmin) && (
            <>
              <li>
                <Link to="/manage-events" style={linkStyle}>
                  <RiCalendarTodoFill style={iconStyle} /> Manage Events
                </Link>
              </li>
              <li>
                <Link to="/manage-horses" style={linkStyle}>
                  <GiHorseHead style={iconStyle} /> Manage Horses
                </Link>
              </li>
              <li>
                <Link to="/manage-riders" style={linkStyle}>
                  <FaUserFriends style={iconStyle} /> Manage Riders
                </Link>
              </li>
              <li>
                <Link to="/manage-announcements" style={linkStyle}>
                  <BsFillChatQuoteFill style={iconStyle} /> Manage Announcements
                </Link>
              </li>
              {(isAdmin || isSuperAdmin) && (
                <li>
                  <Link to="/user-management" style={linkStyle}>
                    <RiUserSearchFill style={iconStyle} /> User Management
                  </Link>
                </li>
              )}
              <li>
                <Link to="/randomize" style={linkStyle}>
                  <BiShuffle style={iconStyle} /> Randomize
                </Link>
              </li>
            </>
          )}
          <li>
            <Link to="/results" style={linkStyle}>
              <BiShuffle style={iconStyle} /> Results
            </Link>
          </li>
          <li>
            <Link to="/gallery" style={linkStyle}>
              <RiImageFill style={iconStyle} /> Gallery
            </Link>
          </li>
          <li>
            <Link to="/announcements" style={linkStyle}>
              <BsFillChatQuoteFill style={iconStyle} /> Announcements
            </Link>
          </li>
          <li>
            <Link to="/about" style={linkStyle}>
              <RiUserFill style={iconStyle} /> About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" style={linkStyle}>
              <RiUserFill style={iconStyle} /> Contact
            </Link>
          </li>
          <li>
            {userRole ? (
              <button className="login" onClick={showLogoutModal} style={linkStyle}>
                <RiLogoutBoxFill style={iconStyle} /> Logout
              </button>
            ) : (
              <Link to="/login" className="login" style={linkStyle}>
                <RiUserFill style={iconStyle} /> Login
              </Link>
            )}
          </li>
        </ul>
      </div>
      <Modal
        title="Confirm Logout"
        open={logoutModalVisible}
        onOk={confirmLogout}
        onCancel={handleCancelLogout}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default NavBar;
