import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, style }) => {
  const formatDateAndTime = (dateString, timeString) => {
    const date = dateString.split('T')[0]; // Extract the date part
    const time = timeString.split('.')[0]; // Extract the time part
    return `${date} ${time}`;
  };

  return (
    <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="event-card" style={style}>
        <img src={event.image} alt={event.name} />
        <div className="event-card-info">
          <h3>{event.name}</h3>
          <div className="venue">
            <strong>Venue:</strong> {event.venue}
          </div>
          <div className="date-time">
            <strong>Start:</strong> {formatDateAndTime(event.start_date, event.start_time)}
          </div>
          <div className="date-time">
            <strong>End:</strong> {formatDateAndTime(event.end_date, event.end_time)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
