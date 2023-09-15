import React from 'react';
import NavBar from './NavBar';
import styled from 'styled-components';
import { FaPhone, FaGlobeAmericas } from 'react-icons/fa';

import VangariImage from '../assets/developers/Vangari.png';
import GaddamImage from '../assets/developers/Gaddam.png';
import KadaliImage from '../assets/developers/Kadali.png';
import PendliImage from '../assets/developers/Pendli.png';
import PeruruImage from '../assets/developers/Peruru.png';
import SuraImage from '../assets/developers/Sura.png';
import FellahImage from '../assets/developers/fellah.png';
import HeroImage from '../assets/developers/contact-hero.jpg';

const developers = [
  { name: 'Shiva Vangari', designation: 'TEAM LEAD/ DEVELOPER', photo: VangariImage },
  { name: 'Vedha Sri Gaddam', designation: 'FRONTEND', photo: GaddamImage },
  { name: 'Kiran Kadali', designation: 'DATABASE', photo: KadaliImage },
  { name: 'Sai Kiran Pendli', designation: 'DATABASE', photo: PendliImage },
  { name: 'Ambica Peruru', designation: 'BACKEND', photo: PeruruImage },
  { name: 'Pooja Sura', designation: 'FRONTEND', photo: SuraImage }
];

const ContactPage = ({ userRole, handleLogout }) => {
  return (
    <Container>
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <Hero>
        <HeroContent>
          <HeroTitle>Contact Us</HeroTitle>
        </HeroContent>
      </Hero>
      <DevelopersSection>
        <SubHeading>Our Team</SubHeading>
        <DevelopersContainer>
          {developers.map((developer, index) => (
            <DeveloperCard key={index}>
              <DeveloperImageContainer>
                <DeveloperImage src={developer.photo} alt={developer.name} />
              </DeveloperImageContainer>
              <DeveloperName>{developer.name}</DeveloperName>
              <DeveloperDesignation>{developer.designation}</DeveloperDesignation>
            </DeveloperCard>
          ))}
        </DevelopersContainer>
      </DevelopersSection>
      <MentorSection>
        <SubHeading>Our Mentor</SubHeading>
        <MentorImageContainer>
          <MentorImage src={FellahImage} alt="Dr. Aziz Fellah" />
        </MentorImageContainer>
        <DeveloperName>Dr. Aziz Fellah (Mentor)</DeveloperName>
        <MentorEmail>afellah@nwmissouri.edu</MentorEmail>
      </MentorSection>
      <Subtitle>Contact Us</Subtitle>
      <HeroSubtitle>Have a question or need support? Reach out to us.</HeroSubtitle>
      <ContactOptions>
        <ContactOption>
          <FaGlobeAmericas size={24} />
          <ContactLabel>ihsainc.com</ContactLabel>
        </ContactOption>
        <ContactOption>
          <FaPhone size={24} />
          <ContactLabel>+1(844)307-4472</ContactLabel>
        </ContactOption>
      </ContactOptions>
    </Container>
  );
};

const Container = styled.div``;

const Hero = styled.div`
  position: relative;
`;

const HeroContent = styled.div`
  background-image: url(${HeroImage});
  background-size: cover;
  background-position: center;
  padding: 20px 0;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
`;

const SubHeading = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const DevelopersSection = styled.section`
  text-align: center;
  background: #f5f5f5;
  padding: 50px 0;
`;

const DevelopersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const DeveloperCard = styled.div`
  width: 180px;
  margin: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DeveloperImageContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const DeveloperImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeveloperName = styled.p`
  font-size: 18px;
  margin-top: 10px;
  font-weight: bold;
`;

const DeveloperDesignation = styled.p`
  font-size: 16px;
  margin-top: 1px; 
`;

const MentorSection = styled.section`
  text-align: center;
  padding: 10px 0;
  background: #EFECEB;
`;

const MentorImageContainer = styled.div`
  display: inline-block;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const MentorImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MentorEmail = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #555;
`;

const ContactOptions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const ContactOption = styled.div`
  display: flex;
  align-items: center;
  margin: 0 15px;
  font-size: 16px;
`;

const ContactLabel = styled.span`
  margin-left: 10px;
`;

const Subtitle = styled.h3`
  text-align: center;
  font-size: 24px;
  margin-top: 200px;
`;

const HeroSubtitle = styled.p`
  text-align: center;
  font-size: 18px;
  color: #ccc;
  margin-top: 10px;
`;

export default ContactPage;
