import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, style }) => {

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    let period = 'AM';
    let hoursFormatted = parseInt(hours, 10);

    if (hoursFormatted > 12) {
      hoursFormatted -= 12;
      period = 'PM';
    }

    return `${hoursFormatted}:${minutes} ${period}`;
  };

  const formatTimezone = (timezone) => {
    // Replace with your timezone formatting logic
    return timezone;
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
            <strong>Start:</strong> {formatTime(event.start_time)} <strong>End:</strong> {formatTime(event.end_time)}{' '}
            {formatTimezone(event.timezone)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
