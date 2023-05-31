import React from 'react';
import { Link } from 'react-router-dom';
import { RiHomeFill, RiMapPin2Fill, RiImageFill, RiUserFill } from 'react-icons/ri';
import { BsFillChatQuoteFill } from 'react-icons/bs';
import logo from '../assets/ihsalogo.png';
import '../navbar.css';

const NavBar = () => {
  return (
    <div className="navbar">
      <Link to="/" className="logo-link"><img src={logo} alt="Logo" className="logo" /></Link>
      <ul className="menu">
        <li><Link to="/"><RiHomeFill size={20} /> Home</Link></li>
        <li><Link to="/map"><RiMapPin2Fill size={20} /> Map</Link></li>
        <li><Link to="/randomize"><RiMapPin2Fill size={20} /> Randomize</Link></li>
        <li><Link to="/gallery"><RiImageFill size={20} /> Gallery</Link></li>
        <li><Link to="/announcements"><BsFillChatQuoteFill size={20} /> Announcements</Link></li>
        <li><Link to="/about"><RiUserFill size={20} /> About Us</Link></li>
        <li><Link to="/contact"><RiUserFill size={20} /> Contact</Link></li>
      </ul>
      <Link to="/login" className="login"><RiUserFill size={20} /> Login</Link>
    </div>
  );
};

export default NavBar;
