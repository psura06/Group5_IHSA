import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylings/announcementPage.css';
import NavBar from './NavBar'

const AnnouncementsPage = ({ userRole, handleLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/announcements')
      .then(response => {
        // Convert date to 'yyyy-mm-dd' format right after fetching from the server
        const formattedData = response.data.map(item => {
          const date = new Date(item.date);
          const formattedDate = date.toLocaleDateString('en-CA');
          return { ...item, date: formattedDate };
        });
        setAnnouncements(formattedData);
      })
      .catch(error => console.log(error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearDate = () => {
    setSelectedDate('');
  };

  const filteredAnnouncements = announcements
    .filter((announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((announcement) =>
      selectedDate ? announcement.date === selectedDate : true
    );

  return (
    <div className="announcements-page">
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <h1 className="announcements-title">ANNOUNCEMENTS</h1>
      <div className="search-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search announcement..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="clear-button" onClick={clearSearch}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="filter-container">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
          {selectedDate && (
            <button className="clear-button" onClick={clearDate}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>
      <div className="gap"></div>
      <div className="announcements-grid">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="announcement-card">
            <div className="announcement-header">
              <h3 className="announcement-title">{announcement.title}</h3>
              <span className="announcement-date-time">
                {`${announcement.date} ${announcement.time}`}
              </span>
            </div>
            <div className="announcement-content">
              <p>{announcement.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
