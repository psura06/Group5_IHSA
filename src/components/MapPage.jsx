import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

import 'leaflet/dist/leaflet.css';
import '../styles.css';

// Import the pin icons
import markerIconZone1 from '../assets/pinredzone1.png';
import markerIconZone2 from '../assets/pinyellowzone2.png';
import markerIconZone3 from '../assets/pinbluezone3.png';
import markerIconZone4 from '../assets/pinblackzone4.png';
import markerIconZone5 from '../assets/pingreenzone5.png';
import markerIconZone6 from '../assets/pinbrownzone6.png';
import markerIconZone7 from '../assets/pinpinkzone7.png';
import markerIconZone8 from '../assets/pinskybluezone8.png';

// Import the flag icons
import flagIconZone1 from '../assets/flagredzone1.png';
import flagIconZone2 from '../assets/flagyellowzone2.png';
import flagIconZone3 from '../assets/flagbluezone3.png';
import flagIconZone4 from '../assets/flagblackzone4.png';
import flagIconZone5 from '../assets/flaggreenzone5.png';
import flagIconZone6 from '../assets/flagbrownzone6.png';
import flagIconZone7 from '../assets/flagpinkzone7.png';
import flagIconZone8 from '../assets/flagskybluezone8.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

const zones = [
  { id: 1, color: '#FF0000', markerIcon: markerIconZone1, flagIcon: flagIconZone1 },
  { id: 2, color: '#FFA500', markerIcon: markerIconZone2, flagIcon: flagIconZone2 },
  { id: 3, color: '#FFFF00', markerIcon: markerIconZone3, flagIcon: flagIconZone3 },
  { id: 4, color: '#008000', markerIcon: markerIconZone4, flagIcon: flagIconZone4 },
  { id: 5, color: '#0000FF', markerIcon: markerIconZone5, flagIcon: flagIconZone5 },
  { id: 6, color: '#4B0082', markerIcon: markerIconZone6, flagIcon: flagIconZone6 },
  { id: 7, color: '#800080', markerIcon: markerIconZone7, flagIcon: flagIconZone7 },
  { id: 8, color: '#FF00FF', markerIcon: markerIconZone8, flagIcon: flagIconZone8 },
];

function MapLegend() {
  return (
    <div className="map-legend">
      <h3>Legend</h3>
      {zones.map(zone => (
        <div key={zone.id} className="zone-item">
          <div className="zone-color" style={{ backgroundColor: zone.color }}></div>
          <div className="zone-label">Zone {zone.id}</div>
        </div>
      ))}
      <div className="zone-item">
        <div className="zone-color anchor-school"></div>
        <div className="zone-label">Flags are anchor schools</div>
      </div>
    </div>
  );
}

function MapPage() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isTableVisible, setTableVisible] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:8000/api/schools') // Update the request URL to include the server address
      .then(response => {
        setSchools(response.data);
      })
      .catch(error => {
        console.error('Error fetching schools:', error);
      });
  }, []);

  const handleClick = (school) => {
    setSelectedSchool(school);
    setTableVisible(true);
  };

  const handleTableClick = (school) => {
    setSelectedSchool(school);
    const { latitude, longitude } = school;
    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], 13);
    }
  };

  const selectedPinRegion = selectedSchool ? selectedSchool.region_number : null;
  const regionSchools = schools.filter(school => school.region_number === selectedPinRegion && school.latitude !== selectedSchool?.latitude && school.longitude !== selectedSchool?.longitude);

  const handleArrowButtonClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="map-page">
      <MapContainer center={[38.9072, -77.0369]} zoom={5} style={{ height: '100%', width: '100%' }} ref={mapRef}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {schools.map(school => (
          <Marker
            key={school.id}
            position={[school.latitude, school.longitude]}
            icon={new L.Icon({
              iconUrl: school.is_anchor_school ? zones[school.zone_number - 1].flagIcon : zones[school.zone_number - 1].markerIcon,
              iconSize: [25, 41],
              iconAnchor: [12, 41]
            })}
            eventHandlers={{
              click: () => handleClick(school),
            }}
          >
            <Popup>
              <h2>{school.college_name}</h2>
              <p>Active riders: {school.active_riders}</p>
              <p>Is anchor school: {school.is_anchor_school ? 'Yes' : 'No'}</p>
              <p>Mileage: {school.mileage}</p>
              <p>State name: {school.state_name}</p>
              <p>Region number: {school.region_number}</p>
            </Popup>
          </Marker>
        ))}
        <MapLegend />
      </MapContainer>
      {isTableVisible && (
        <div className="school-table visible">
          <h2>Selected School</h2>
          <table>
            <thead>
              <tr>
                <th>College Name</th>
                <th>State Name</th>
                <th>Active Riders</th>
                <th>Is Anchor School</th>
                <th>Region Number</th>
                <th>Zone Number</th>
                <th>Mileage</th>
              </tr>
            </thead>
            <tbody>
              {regionSchools.map(school => (
                <tr
                  key={school.id}
                  className={selectedSchool && selectedSchool.id === school.id ? 'selected-school' : ''}
                  onClick={() => handleTableClick(school)}
                >
                  <td>{school.college_name}</td>
                  <td>{school.state_name}</td>
                  <td>{school.active_riders}</td>
                  <td>{school.is_anchor_school ? 'Yes' : 'No'}</td>
                  <td>{school.region_number}</td>
                  <td>{school.zone_number}</td>
                  <td>{school.mileage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="arrow-button" onClick={handleArrowButtonClick}>
        <svg className="arrow-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
    </div>
  );
}

export default MapPage;
