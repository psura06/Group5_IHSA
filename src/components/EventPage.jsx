import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { getEvents } from './api';
import moment from 'moment';
import '../stylings/eventPage.css'; // Import the CSS file for EventPage

const EventPage = ({ userRole, handleLogout }) => {
  const location = useLocation();
  const eventId = location.pathname.split('/')[2];
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const events = await getEvents();
        console.log('Fetched events:', events);
        const foundEvent = events.find((event) => event.id.toString() === eventId);
        console.log('Found event:', foundEvent);
        setEvent(foundEvent);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) {
    return (
      <div>
        <NavBar />
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="event-page">
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <div className="event-image-container">
        <img src={event.image} alt={event.name} className="event-image" />
      </div>
      <div className="event-details">
        <h2 className="event-name">{event.name}</h2>
        <p className="event-venue">Venue: {event.venue}</p>
        <div className="event-datetime">
          <div className="event-date-time">
            <span className="datetime-label">Start Date/Time:</span> {moment(event.start_date).format('YYYY-MM-DD')} {event.start_time}
          </div>
          <div className="event-date-time">
            <span className="datetime-label">End Date/Time:</span> {moment(event.end_date).format('YYYY-MM-DD')} {event.end_time}
          </div>
        </div>
        <p className="event-description">{event.description}</p>
      </div>
    </div>
  );
};

export default EventPage;
