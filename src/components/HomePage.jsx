import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../stylings/homePage.css';
import EventCard from './EventCard';
import { getEvents } from '../api';
import moment from 'moment';
import Sponsors from './Sponsors';

import Image1 from '../assets/carousel/c1.jpg';
import Image2 from '../assets/carousel/c2.jpg';
import Image3 from '../assets/carousel/c3.jpg';
import Image4 from '../assets/carousel/c4.jpg';
import Image5 from '../assets/carousel/c5.jpg';

const HomePage = ({ userRole, handleLogout }) => { 
  const carouselImages = [Image1, Image2, Image3, Image4, Image5];
  const eventCardContainerRef = useRef(null);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    loadEvents();

    // Fetch announcements from the server
    axios.get('http://localhost:8000/api/announcements')
      .then(response => {
        setAnnouncements(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const loadEvents = async () => {
    try {
      const events = await getEvents();
      const currentDate = moment();
      const ongoing = [];
      const upcoming = [];
      const past = [];

      events.forEach((event) => {
        const startDateTime = moment(`${event.start_date} ${event.start_time}`, 'YYYY-MM-DD HH:mm');
        const endDateTime = moment(`${event.end_date} ${event.end_time}`, 'YYYY-MM-DD HH:mm');

        if (currentDate.isBetween(startDateTime, endDateTime, null, '[]')) {
          ongoing.push(event);
        } else if (currentDate.isBefore(startDateTime)) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
      });

      setOngoingEvents(ongoing);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="home-page">
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <div className="announcement-container">
        <div className="announcement-scroll">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-item">
              <Link to={`/announcements/${announcement.id}`}>
                <h2>{announcement.title}</h2>
              </Link>
              <p>{announcement.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Slider {...carouselSettings}>
        {carouselImages.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`carousel_image${index + 1}`} />
          </div>
        ))}
      </Slider>
      <div className="about-card">
        <div className="about-header">
          <Link to="/about" className="header-link">
            <h2>ABOUT IHSA</h2>
          </Link>
        </div>
        <div className="about-content">
          <p>
            The Intercollegiate Horse Shows Association (IHSA), a non-profit group of men and women of various riding
            abilities, promotes individual and team competition in hunter seat equitation, Western horsemanship, and
            reining at more than 400 member schools and institutions. Regardless of their level of knowledge or financial
            situation, IHSA members attend horse events. With furnished horses, students compete at levels from novice to
            advanced,saving money on the expense of owning a horse.
          </p>
        </div>
      </div>
      <div className="content-card">
      <div className="events-container">
        <h2>ONGOING EVENTS</h2>
        <div className="event-card-scroll">
          <div ref={eventCardContainerRef} className="event-card-container">
            {ongoingEvents.map((event) => (
              <EventCard key={event.id} event={event} style={{ width: '250px', height: '400px' }} />
            ))}
          </div>
         
        </div>
      </div>
      <div className="events-container">
        <h2>UPCOMING EVENTS</h2>
        <div className="event-card-scroll">
          <div ref={eventCardContainerRef} className="event-card-container">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} style={{ width: '250px', height: '400px' }} />
            ))}
          </div>
         
        </div>
      </div>
      <div className="events-container">
        <h2>PAST EVENTS</h2>
        <div className="event-card-scroll">
          <div ref={eventCardContainerRef} className="event-card-container">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} style={{ width: '250px', height: '400px' }} />
            ))}
          </div>
          
        </div>
      </div>
    </div>
    <Sponsors />
    </div>
  );
};

export default HomePage;
