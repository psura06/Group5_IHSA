import React from 'react';
import '../aboutPage.css';
import aboutImage from '../assets/events/event4.jpg';

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1 className="about-title">ABOUT US</h1>
      <div className="about-info">
        The Intercollegiate Horse Shows Association (IHSA), a non-profit group of men and women of various riding abilities,
        promotes individual and team competition in hunter seat equitation, Western horsemanship, and reining at more than 400
        member schools and institutions. Regardless of their level of knowledge or financial situation, IHSA members attend horse events.
        With furnished horses, students compete at levels from novice to advanced, saving money on the expense of owning a horse.
      </div>
      <div className="about-image">
        <img src={aboutImage} alt="" />
      </div>
      <h2 className="mission-title">Mission</h2>
      <div className="mission-info">
        The Intercollegiate Horse Show Association (IHSA) would be to provide college students with an organized and inclusive platform
        to participate in equestrian sports.
      </div>
      <h2 className="about-site-title">About this Site</h2>
      <div className="about-site-info">
        The primary goal of this project is to assign the horse according to the ability of riders by using the randomizer functionality.
        Additionally, every user should be able to view zoning, and the show administrator is responsible for updating and maintaining all
        information related to the show.
      </div>
    </div>
  );
};

export default AboutPage;
