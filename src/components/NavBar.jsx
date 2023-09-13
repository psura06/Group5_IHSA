import React from 'react';
import { Link } from 'react-router-dom';
import { RiHomeFill, RiMapPin2Fill, RiImageFill, RiUserFill, RiCalendarTodoFill, RiUserSearchFill, RiLogoutBoxFill } from 'react-icons/ri';
import { GiHorseHead } from 'react-icons/gi';
import { FaUserFriends } from 'react-icons/fa';
import { BsFillChatQuoteFill } from 'react-icons/bs';
import { BiShuffle } from 'react-icons/bi'; // Importing Randomize Icon
import logo from '../assets/ihsalogo.png';
import '../stylings/navbar.css';

const NavBar = ({ userRole, handleLogout }) => {
  const isAdmin = userRole === 'admin';
  const isShowAdmin = userRole === 'showadmin';

  return (
    <div className="navbar">
      <Link to="/" className="logo-link">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <ul className="menu">
        <li>
          <Link to="/">
            <RiHomeFill size={20} /> Home
          </Link>
        </li>
        <li>
          <Link to="/map">
            <RiMapPin2Fill size={20} /> Map
          </Link>
        </li>
        {(isAdmin || isShowAdmin) && (
          <>
            <li>
              <Link to="/manage-events">
                <RiCalendarTodoFill size={20} /> Manage Events
              </Link>
            </li>
            <li>
              <Link to="/manage-horses">
                <GiHorseHead size={20} /> Manage Horses
              </Link>
            </li>
            <li>
              <Link to="/manage-riders">
                <FaUserFriends size={20} /> Manage Riders
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/user-management">
                  <RiUserSearchFill size={20} /> User Management
                </Link>
              </li>
            )}
            <li>
              <Link to="/randomize">
                <BiShuffle size={20} /> Randomize
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/gallery">
            <RiImageFill size={20} /> Gallery
          </Link>
        </li>
        <li>
          <Link to="/announcements">
            <BsFillChatQuoteFill size={20} /> Announcements
          </Link>
        </li>
        <li>
          <Link to="/about">
            <RiUserFill size={20} /> About Us
          </Link>
        </li>
        <li>
          <Link to="/contact">
            <RiUserFill size={20} /> Contact
          </Link>
        </li>
        <li>
      {userRole ? (
        <button className="login" onClick={handleLogout}>
          <RiLogoutBoxFill size={20} /> Logout
        </button>
      ) : (
        <Link to="/login" className="login">
          <RiUserFill size={20} /> Login
        </Link>
      )}
      </li>
      </ul>
    </div>
  );
};

export default NavBar;
