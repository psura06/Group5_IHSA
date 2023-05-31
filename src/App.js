import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from './components/NavBar';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AdminPage from './components/AdminPage';
import MapPage from './components/MapPage';
import AnnouncementsPage from './components/AnnouncementsPage';
import GalleryPage from './components/GalleryPage';
import EventPage from './components/EventPage';
import LoginPage from './components/LoginAdminPage';
import RandomizePage from './components/RandomizePage';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/randomize" element={<RandomizePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/announcements/:id" element={<AnnouncementsPage />} />
            <Route path="/events/:id" element={<EventPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
