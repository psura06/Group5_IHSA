import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Sponsor1 from '../assets/sponsors/sponsor1.jpg';
import Sponsor2 from '../assets/sponsors/sponsor2.jpg';
import Sponsor3 from '../assets/sponsors/sponsor3.jpg';
import Sponsor4 from '../assets/sponsors/sponsor4.jpg';
import Sponsor5 from '../assets/sponsors/sponsor5.jpg';
import Sponsor6 from '../assets/sponsors/sponsor6.jpg';
import Sponsor7 from '../assets/sponsors/sponsor7.jpg';
import Sponsor8 from '../assets/sponsors/sponsor8.jpg';
import Sponsor9 from '../assets/sponsors/sponsor9.jpg';
import Sponsor10 from '../assets/sponsors/sponsor10.jpg';
import Sponsor11 from '../assets/sponsors/sponsor11.jpg';
import Sponsor12 from '../assets/sponsors/sponsor12.jpg';
import Sponsor13 from '../assets/sponsors/sponsor13.jpg';
import Sponsor14 from '../assets/sponsors/sponsor14.jpg';
import Sponsor15 from '../assets/sponsors/sponsor15.jpg';
import Sponsor16 from '../assets/sponsors/sponsor16.jpg';
import '../stylings/sponsors.css';

const Sponsors = () => {
  const sponsorImages = [
    Sponsor1, Sponsor2, Sponsor3, Sponsor4, Sponsor5,
    Sponsor6, Sponsor7, Sponsor8, Sponsor9, Sponsor10,
    Sponsor11, Sponsor12, Sponsor13, Sponsor14, Sponsor15,
    Sponsor16
  ];
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    variableWidth: true,
    arrows: false,
  };

  return (
    <div className="sponsor-card">
      <h2>SPONSORS</h2>
      <Slider {...settings}>
        {sponsorImages.map((sponsor, index) => (
          <div key={index} className="sponsor-img-wrapper">
            <img src={sponsor} alt={`Sponsor ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Sponsors;