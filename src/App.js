import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AdminPage from './components/AdminPage';
import MapPage from './components/MapPage';
import AnnouncementsPage from './components/AnnouncementsPage';
import GalleryPage from './components/GalleryPage';
import EventPage from './components/EventPage';
import LoginAdminPage from './components/LoginAdminPage';
import RandomizePage from './components/RandomizePage';
import ManageEventsPage from './components/ManageEventsPage';
import ManageRidersPage from './components/ManageRidersPage';
import ManageHorsesPage from './components/ManageHorsesPage';
import UserManagementPage from './components/UserManagementPage';
import UserHandler from './UserHandler';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <UserHandler>
          {({ userRole, handleLogout, setUserRole }) => (
            <Routes>
              <Route path="/" element={<HomePage userRole={userRole} handleLogout={handleLogout} />} />
              <Route path="/about" element={<AboutPage userRole={userRole} handleLogout={handleLogout} />} />
              <Route path="/contact" element={<ContactPage userRole={userRole} handleLogout={handleLogout} />} />
              {userRole === 'admin' && <Route path="/admin" element={<AdminPage userRole={userRole} handleLogout={handleLogout} />} />}
              <Route
                path="/login"
                element={<LoginAdminPage setUserRole={setUserRole} />}
              />
              <Route path="/map" element={<MapPage userRole={userRole} handleLogout={handleLogout} />} />
              {userRole === 'admin' || userRole === 'showAdmin' ? (
                <Route path="/randomize" element={<RandomizePage userRole={userRole} handleLogout={handleLogout} />} />
              ) : null}
              <Route path="/gallery" element={<GalleryPage userRole={userRole} handleLogout={handleLogout} />} />
              <Route path="/announcements" element={<AnnouncementsPage userRole={userRole} handleLogout={handleLogout} />} />
              <Route path="/announcements/:id" element={<AnnouncementsPage userRole={userRole} handleLogout={handleLogout} />} />
              <Route path="/events/:id" element={<EventPage userRole={userRole} handleLogout={handleLogout} />} />
              {userRole === 'admin' && <Route path="/manage-events" element={<ManageEventsPage userRole={userRole} handleLogout={handleLogout} />} />}
              {userRole === 'admin' && <Route path="/manage-riders" element={<ManageRidersPage userRole={userRole} handleLogout={handleLogout} />} />}
              {userRole === 'admin' && <Route path="/manage-horses" element={<ManageHorsesPage userRole={userRole} handleLogout={handleLogout} />} />}
              {userRole === 'admin' && <Route path="/user-management" element={<UserManagementPage userRole={userRole} handleLogout={handleLogout} />} />}
            </Routes>
          )}
        </UserHandler>
      </div>
    </Router>
  );
};

export default App;
