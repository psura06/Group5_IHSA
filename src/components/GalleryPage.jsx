import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import event1 from '../assets/events/event1.jpg';
import event2 from '../assets/events/event2.jpg';
import event3 from '../assets/events/event3.jpg';
import event4 from '../assets/events/event4.jpg';
import event5 from '../assets/events/event5.jpg';
import event6 from '../assets/events/event6.jpg';
import event7 from '../assets/events/event7.jpg';
// Add more event images as needed

import '../galleryPage.css';

const events = [
  { id: 1, name: 'Event 1', image: event1, link: 'https://drive.google.com' },
  { id: 2, name: 'Event 2', image: event2, link: 'https://drive.google.com' },
  { id: 3, name: 'Event 3', image: event3, link: 'https://drive.google.com' },
  { id: 4, name: 'Event 4', image: event4, link: 'https://drive.google.com' },
  { id: 5, name: 'Event 5', image: event5, link: 'https://drive.google.com' },
  { id: 6, name: 'Event 6', image: event6, link: 'https://drive.google.com' },
  { id: 7, name: 'Event 7', image: event7, link: 'https://drive.google.com' },
  // Add more events as needed
];

const GalleryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const eventsPerPage = 6;

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // const navigate = useNavigate();

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
              <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer">
                {selectedEvent.link}
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
