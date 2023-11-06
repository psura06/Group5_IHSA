import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RiHomeFill,
  RiMapPin2Fill,
  RiImageFill,
  RiUserFill,
  RiCalendarTodoFill,
  RiUserSearchFill,
  RiLogoutBoxFill,
  RiMenu3Fill,
} from 'react-icons/ri';
import { GiHorseHead } from 'react-icons/gi';
import { FaUserFriends } from 'react-icons/fa';
import { BsFillChatQuoteFill } from 'react-icons/bs';
import { BiShuffle } from 'react-icons/bi';
import logo from '../assets/ihsalogo.png';
import '../stylings/navbar.css';
import { Modal, message, Button, Drawer, Menu } from 'antd';

const iconStyle = {
  fontSize: '20px',
  color: 'white', // Added white color
};

const linkStyle = {
  fontSize: '12px',
  color: 'white', // Added white color
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  padding: '0.2rem',
  position: 'relative',
};

const NavBar = ({ userRole, handleLogout }) => {
  const isAdmin = userRole === 'admin';
  const isShowAdmin = userRole === 'showadmin';
  const isSuperAdmin = userRole === 'superadmin';

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="navbar">
      <Link to="/" className="logo-link">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      {isMobile ? (
        <Button
          icon={<RiMenu3Fill style={iconStyle} />}
          onClick={() => setMenuVisible(true)}
          className="menu-button"
        />
      ) : (
        <Menu
          theme="dark" // Added dark theme
          mode="horizontal"
          selectable={false}
          style={{ backgroundColor: 'navy', border: 'none' }}
        >
          <Menu.Item key="home">
            <Link to="/" style={linkStyle}>
              <RiHomeFill style={iconStyle} /> Home
            </Link>
          </Menu.Item>
          <Menu.Item key="map">
            <Link to="/map" style={linkStyle}>
              <RiMapPin2Fill style={iconStyle} /> Map
            </Link>
          </Menu.Item>
          {(isAdmin || isShowAdmin || isSuperAdmin) && (
            <>
              <Menu.Item key="manage-events">
                <Link to="/manage-events" style={linkStyle}>
                  <RiCalendarTodoFill style={iconStyle} /> Manage Events
                </Link>
              </Menu.Item>
              <Menu.Item key="manage-horses">
                <Link to="/manage-horses" style={linkStyle}>
                  <GiHorseHead style={iconStyle} /> Manage Horses
                </Link>
              </Menu.Item>
              <Menu.Item key="manage-riders">
                <Link to="/manage-riders" style={linkStyle}>
                  <FaUserFriends style={iconStyle} /> Manage Riders
                </Link>
              </Menu.Item>
              <Menu.Item key="manage-announcements">
                <Link to="/manage-announcements" style={linkStyle}>
                  <BsFillChatQuoteFill style={iconStyle} /> Manage Announcements
                </Link>
              </Menu.Item>
              {(isAdmin || isSuperAdmin) && (
                <Menu.Item key="user-management">
                  <Link to="/user-management" style={linkStyle}>
                    <RiUserSearchFill style={iconStyle} /> User Management
                  </Link>
                </Menu.Item>
              )}
              <Menu.Item key="randomize">
                <Link to="/randomize" style={linkStyle}>
                  <BiShuffle style={iconStyle} /> Randomize
                </Link>
              </Menu.Item>
            </>
          )}
          <Menu.Item key="results">
            <Link to="/results" style={linkStyle}>
              <BiShuffle style={iconStyle} /> Results
            </Link>
          </Menu.Item>
          <Menu.Item key="gallery">
            <Link to="/gallery" style={linkStyle}>
              <RiImageFill style={iconStyle} /> Gallery
            </Link>
          </Menu.Item>
          <Menu.Item key="announcements">
            <Link to="/announcements" style={linkStyle}>
              <BsFillChatQuoteFill style={iconStyle} /> Announcements
            </Link>
          </Menu.Item>
          <Menu.Item key="about">
            <Link to="/about" style={linkStyle}>
              <RiUserFill style={iconStyle} /> About Us
            </Link>
          </Menu.Item>
          <Menu.Item key="contact">
            <Link to="/contact" style={linkStyle}>
              <RiUserFill style={iconStyle} /> Contact
            </Link>
          </Menu.Item>
          <Menu.Item key="login">
            {userRole ? (
              <Button
                className="login"
                onClick={showLogoutModal}
                style={linkStyle}
                icon={<RiLogoutBoxFill style={iconStyle} />}
              >
                Logout
              </Button>
            ) : (
              <Link to="/login" className="login" style={linkStyle}>
                <RiUserFill style={iconStyle} /> Login
              </Link>
            )}
          </Menu.Item>
        </Menu>
      )}
      <Modal
        title="Confirm Logout"
        visible={logoutModalVisible}
        onOk={confirmLogout}
        onCancel={handleCancelLogout}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
      {isMobile && (
        <Drawer
          placement="right"
          closable={false}
          onClose={() => setMenuVisible(false)}
          visible={menuVisible}
          bodyStyle={{ padding: 0 }}
        >
          <Menu theme="dark" mode="vertical">
            <Menu.Item key="home">
              <Link to="/" style={linkStyle}>
                <RiHomeFill style={iconStyle} /> Home
              </Link>
            </Menu.Item>
            <Menu.Item key="map">
              <Link to="/map" style={linkStyle}>
                <RiMapPin2Fill style={iconStyle} /> Map
              </Link>
            </Menu.Item>
            {(isAdmin || isShowAdmin || isSuperAdmin) && (
              <>
                <Menu.Item key="manage-events">
                  <Link to="/manage-events" style={linkStyle}>
                    <RiCalendarTodoFill style={iconStyle} /> Manage Events
                  </Link>
                </Menu.Item>
                <Menu.Item key="manage-horses">
                  <Link to="/manage-horses" style={linkStyle}>
                    <GiHorseHead style={iconStyle} /> Manage Horses
                  </Link>
                </Menu.Item>
                <Menu.Item key="manage-riders">
                  <Link to="/manage-riders" style={linkStyle}>
                    <FaUserFriends style={iconStyle} /> Manage Riders
                  </Link>
                </Menu.Item>
                <Menu.Item key="manage-announcements">
                  <Link to="/manage-announcements" style={linkStyle}>
                    <BsFillChatQuoteFill style={iconStyle} /> Manage Announcements
                  </Link>
                </Menu.Item>
                {(isAdmin || isSuperAdmin) && (
                  <Menu.Item key="user-management">
                    <Link to="/user-management" style={linkStyle}>
                      <RiUserSearchFill style={iconStyle} /> User Management
                    </Link>
                  </Menu.Item>
                )}
                <Menu.Item key="randomize">
                  <Link to="/randomize" style={linkStyle}>
                    <BiShuffle style={iconStyle} /> Randomize
                  </Link>
                </Menu.Item>
              </>
            )}
            <Menu.Item key="results">
              <Link to="/results" style={linkStyle}>
                <BiShuffle style={iconStyle} /> Results
              </Link>
            </Menu.Item>
            <Menu.Item key="gallery">
              <Link to="/gallery" style={linkStyle}>
                <RiImageFill style={iconStyle} /> Gallery
              </Link>
            </Menu.Item>
            <Menu.Item key="announcements">
              <Link to="/announcements" style={linkStyle}>
                <BsFillChatQuoteFill style={iconStyle} /> Announcements
              </Link>
            </Menu.Item>
            <Menu.Item key="about">
              <Link to="/about" style={linkStyle}>
                <RiUserFill style={iconStyle} /> About Us
              </Link>
            </Menu.Item>
            <Menu.Item key="contact">
              <Link to="/contact" style={linkStyle}>
                <RiUserFill style={iconStyle} /> Contact
              </Link>
            </Menu.Item>
            <Menu.Item key="login">
              {userRole ? (
                <Button
                  className="login"
                  onClick={showLogoutModal}
                  style={linkStyle}
                  icon={<RiLogoutBoxFill style={iconStyle} />}
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login" className="login" style={linkStyle}>
                  <RiUserFill style={iconStyle} /> Login
                </Link>
              )}
            </Menu.Item>
          </Menu>
        </Drawer>
      )}
    </div>
  );
};

export default NavBar;
