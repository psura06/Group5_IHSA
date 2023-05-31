import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../announcementPage.css';

export const announcements = [
  { id: 1, title: 'Important Announcement', content: 'PASSING THE BATON: THE NEXT GENERATION OF COACHES EMERGE WITH WIN FIRSTS AT THE IHSA NATIONAL CHAMPIONSHIP HORSE SHOW.', date: '2023-05-28', time: '10:00 AM' },
  { id: 2, title: 'New Update', content: 'THE RISE OF THE UNIVERSITY OF CONNECTICUT WESTERN TEAM', date: '2023-05-27', time: '02:30 PM' },
  { id: 3, title: 'Upcoming Event', content: 'AWARDS PRESENTED ON FINAL DAY OF 2023 IHSA NATIONAL CHAMPIONSHIP HORSE SHOW.', date: '2023-05-26', time: '05:00 PM' },
  // Add more announcements as needed
];

const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { id } = useParams();

  const filteredAnnouncements = announcements
    .filter((announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((announcement) =>
      selectedDate ? announcement.date === selectedDate : true
    );

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

  if (id) {
    const announcement = announcements.find(
      (announcement) => announcement.id === Number(id)
    );

    if (!announcement) {
      return <div>Announcement not found.</div>;
    }

    return (
      <div className="announcement-page">
        <h1 className="announcement-title">{announcement.title}</h1>
        <div className="announcement-content">
          <p>{announcement.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="announcements-page">
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
