import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

import '../stylings/galleryPage.css';

const GalleryPage = ({ userRole, handleLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const eventsPerPage = 6;

  useEffect(() => {
    // Fetch events from your server when the component mounts
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events'); // Replace '/api/events' with your actual API endpoint
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleBack = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="gallery-page">
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <h1 className="gallery-title">GALLERY</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search event..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button className="clear-button" onClick={clearSearch}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      <div className="gap"></div>
      <div className="gallery-grid">
        {currentEvents.map((event) => (
          <div
            key={event.id}
            className="gallery-card"
            style={{ backgroundImage: `url(${event.image})` }}
            onClick={() => handleEventClick(event)}
          >
            <div className="card-overlay">
              <h3 className="event-name">{event.name}</h3>
            </div>
          </div>
        ))}
      </div>
      {selectedEvent && (
        <div className="event-modal">
          <div className="event-modal-content">
            <h2 className="event-header">{selectedEvent.name}</h2>
            <div className="event-link">
              <a href={selectedEvent.gallery} target="_blank" rel="noopener noreferrer">
                View Gallery
              </a>
            </div>
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      )}
      <div className="slider">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
