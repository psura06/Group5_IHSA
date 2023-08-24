import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import NavBar from './NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import 'leaflet/dist/leaflet.css';
import '../stylings/styles.css';

// Import the pin icons
import markerIconZone1 from '../assets/pins/pinredzone1.png';
import markerIconZone2 from '../assets/pins/pinyellowzone2.png';
import markerIconZone3 from '../assets/pins/pinbluezone3.png';
import markerIconZone4 from '../assets/pins/pinblackzone4.png';
import markerIconZone5 from '../assets/pins/pingreenzone5.png';
import markerIconZone6 from '../assets/pins/pinbrownzone6.png';
import markerIconZone7 from '../assets/pins/pinpinkzone7.png';
import markerIconZone8 from '../assets/pins/pinskybluezone8.png';

// Import the flag icons
import flagIconZone1 from '../assets/flags/flagredzone1.png';
import flagIconZone2 from '../assets/flags/flagyellowzone2.png';
import flagIconZone3 from '../assets/flags/flagbluezone3.png';
import flagIconZone4 from '../assets/flags/flagblackzone4.png';
import flagIconZone5 from '../assets/flags/flaggreenzone5.png';
import flagIconZone6 from '../assets/flags/flagbrownzone6.png';
import flagIconZone7 from '../assets/flags/flagpinkzone7.png';
import flagIconZone8 from '../assets/flags/flagskybluezone8.png';

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

function MapPage({ userRole, handleLogout }) {
  // Existing state variables
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isTableVisible, setTableVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [tab, setTab] = useState(0);
  const [collegeNameInput, setCollegeNameInput] = useState('');
  const [latitudeInput, setLatitudeInput] = useState('');
  const [longitudeInput, setLongitudeInput] = useState('');
  const [removeSuccessMessage, setRemoveSuccessMessage] = useState('');
  const [addCollegeSuccessMessage, setAddCollegeSuccessMessage] = useState('');
  const [collegeExists, setCollegeExists] = useState(false); // Track if college exists

  // New state variables for additional input fields
  const [stateNameInput, setStateNameInput] = useState('');
  const [activeRidersInput, setActiveRidersInput] = useState('');
  const [isAnchorSchoolInput, setIsAnchorSchoolInput] = useState('');
  const [regionNumberInput, setRegionNumberInput] = useState('');
  const [zoneNumberInput, setZoneNumberInput] = useState('');
  const [mileageInput, setMileageInput] = useState('');

  const mapRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:8000/api/schools')
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
  const regionSchools = schools.filter(school => school.region_number === selectedPinRegion);

  const selectedSchoolIndex = regionSchools.findIndex(school => school.id === selectedSchool.id);

  useEffect(() => {
    if (selectedSchoolIndex >= 0) {
      const element = document.getElementById(`row-${selectedSchool.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }
  }, [selectedSchool, selectedSchoolIndex]);

  const handleTabClick = (index) => {
    if (index === tab) {
      setCollapsed(!collapsed);
    } else {
      setTab(index);
      setCollapsed(false);
    }
  };

  const handleEditLatLng = () => {
    if (!collegeNameInput) {
      return;
    }

    const college = schools.find(school => school.college_name === collegeNameInput);

    if (!college) {
      // College doesn't exist
      setLatitudeInput('');
      setLongitudeInput('');
      setAddCollegeSuccessMessage('College not found');
      setCollegeExists(false); // Set collegeExists to false
    } else {
      // College exists, allow latitude and longitude editing
      setCollegeExists(true);
      setLatitudeInput('');
      setLongitudeInput('');
      setAddCollegeSuccessMessage('Latitude and longitude can be edited');
    }
  };

  // Update latitude and longitude if college exists
  const handleUpdateLatLng = () => {
    if (!collegeExists || !latitudeInput || !longitudeInput) {
      return;
    }

    const college = schools.find(school => school.college_name === collegeNameInput);

    if (!college) {
      return;
    }

    axios.put(`http://localhost:8000/api/schools/${college.id}`, {
      latitude: latitudeInput,
      longitude: longitudeInput,
    })
      .then(response => {
        setLatitudeInput('');
        setLongitudeInput('');
        setAddCollegeSuccessMessage('Latitude and longitude updated successfully');
        axios.get('http://localhost:8000/api/schools')
          .then(response => {
            setSchools(response.data);
          })
          .catch(error => {
            console.error('Error fetching schools:', error);
          });
      })
      .catch(error => {
        console.error('Error updating latitude and longitude:', error);
      });
  };

  const handleRemoveCollege = () => {
    if (!collegeNameInput) {
      return;
    }

    const college = schools.find(school => school.college_name === collegeNameInput);

    if (!college) {
      return;
    }

    axios.delete(`http://localhost:8000/api/schools/${college.id}`)
      .then(response => {
        setRemoveSuccessMessage('College removed successfully');
        setLatitudeInput('');
        setLongitudeInput('');
        setAddCollegeSuccessMessage('');
        axios.get('http://localhost:8000/api/schools')
          .then(response => {
            setSchools(response.data);
          })
          .catch(error => {
            console.error('Error fetching schools:', error);
          });
      })
      .catch(error => {
        console.error('Error removing college:', error);
      });
  };

  const handleAddCollege = () => {
    if (!collegeNameInput || !latitudeInput || !longitudeInput || !isAnchorSchoolInput) {
      return;
    }

    const collegeExists = schools.some(school => school.college_name === collegeNameInput);

    if (collegeExists) {
      return;
    }

    if (isAnchorSchoolInput !== '0' && isAnchorSchoolInput !== '1') {
      setAddCollegeSuccessMessage('Please enter 0 or 1 for is_anchor_school');
      return;
    }

    axios.post('http://localhost:8000/api/schools', {
      college_name: collegeNameInput,
      state_name: stateNameInput, // Add stateNameInput
      active_riders: activeRidersInput, // Add activeRidersInput
      is_anchor_school: parseInt(isAnchorSchoolInput), // Parse to integer
      region_number: regionNumberInput, // Add regionNumberInput
      zone_number: zoneNumberInput, // Add zoneNumberInput
      mileage: mileageInput, // Add mileageInput
      latitude: latitudeInput,
      longitude: longitudeInput,
    })
      .then(response => {
        setCollegeNameInput('');
        setLatitudeInput('');
        setLongitudeInput('');
        setAddCollegeSuccessMessage(`Successfully added "${collegeNameInput}"`);
        axios.get('http://localhost:8000/api/schools')
          .then(response => {
            setSchools(response.data);
          })
          .catch(error => {
            console.error('Error fetching schools:', error);
          });
      })
      .catch(error => {
        console.error('Error adding college:', error);
      });
  };

  const [isCardVisible, setCardVisible] = useState(false);

  const handleCardToggle = () => {
    setCardVisible(!isCardVisible);
  };
  const [isButtonHovered, setButtonHovered] = useState(false);

// Function to handle button hover
const handleButtonHover = () => {
  setButtonHovered(!isButtonHovered);
};

// Function to handle button click
const handleButtonClick = () => {
  if (!isButtonHovered) {
    handleCardToggle(); // Toggle the card if not hovered
  }
};

  return (
    <div className="map-page">
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      {userRole === 'admin' && (
         <div
         className={`side-button-wrapper ${isButtonHovered ? 'hovered' : ''}`}
         onClick={handleButtonClick}
         onMouseEnter={handleButtonHover}
         onMouseLeave={handleButtonHover}
       >
        <button onClick={handleCardToggle} className={`side-button ${isButtonHovered ? 'hovered' : ''}`}>
         
           <div className="admin-panel-header">
      <FontAwesomeIcon icon={faCog} className="admin-icon" />
      <h2 className="admin-title">Admin Panel</h2>
    </div>
        </button>
        </div>
      )}
      {isCardVisible && (
        <div className={`card ${isCardVisible ? 'visible' : ''}`}>
          <div className="card">
            <div className="tabs">
              <div
                className={`tab ${tab === 0 ? 'active' : ''}`}
                onClick={() => handleTabClick(0)}
              >
                Update
              </div>
              <div
                className={`tab ${tab === 1 ? 'active' : ''}`}
                onClick={() => handleTabClick(1)}
              >
                Remove
              </div>
              <div
                className={`tab ${tab === 2 ? 'active' : ''}`}
                onClick={() => handleTabClick(2)}
              >
                Add
              </div>
            </div>
            <div className="content">
              {tab === 0 && (
                <div>
                  <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter the College Name"
                    value={collegeNameInput}
                    onChange={(e) => setCollegeNameInput(e.target.value)}
                  />
                  </div>
                  <button onClick={handleEditLatLng}>Check College</button>
                  {collegeExists && (
                  <div>
                    <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter Latitude"
                    value={latitudeInput}
                    onChange={(e) => setLatitudeInput(e.target.value)}
                  />
                  </div>
                  <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter Longitude"
                    value={longitudeInput}
                    onChange={(e) => setLongitudeInput(e.target.value)}
                  />
                  </div>
                  <button onClick={handleUpdateLatLng}>Update</button>
                  </div>
               )}
               <p>{addCollegeSuccessMessage}</p>
             </div>
           )}
              {tab === 1 && (
                <div>
                  <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter the College Name"
                    value={collegeNameInput}
                    onChange={(e) => setCollegeNameInput(e.target.value)}
                  />
                  </div>
                  <button onClick={handleRemoveCollege}>Remove</button>
                  <p>{removeSuccessMessage}</p>
                </div>
              )}
              {tab === 2 && (
              <div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter College Name"
                    value={collegeNameInput}
                    onChange={(e) => setCollegeNameInput(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter State Name"
                    value={stateNameInput}
                    onChange={(e) => setStateNameInput(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter Active Riders"
                    value={activeRidersInput}
                    onChange={(e) => setActiveRidersInput(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter 0 or 1 for Anchor School"
                    value={isAnchorSchoolInput}
                    onChange={(e) => setIsAnchorSchoolInput(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter Region Number"
                    value={regionNumberInput}
                    onChange={(e) => setRegionNumberInput(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter Zone Number"
                    value={zoneNumberInput}
                    onChange={(e) => setZoneNumberInput(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter Mileage"
                    value={mileageInput}
                    onChange={(e) => setMileageInput(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter Latitude"
                    value={latitudeInput}
                    onChange={(e) => setLatitudeInput(e.target.value)}
                  />
                  </div>
                  <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter Longitude"
                    value={longitudeInput}
                    onChange={(e) => setLongitudeInput(e.target.value)}
                  />
                  </div>
                  <button onClick={handleAddCollege}>Add</button>
                  <p>{addCollegeSuccessMessage}</p>
                </div>
              )}
            </div>
          </div>
          </div>
        )}
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
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {regionSchools.map((school, index) => (
                <tr
                  key={school.id}
                  id={`row-${school.id}`}
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
                  <td>{school.latitude}</td>
                  <td>{school.longitude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MapPage;
