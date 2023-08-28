import axios from 'axios';

// Use the REACT_APP_BACKEND_URL from the environment variables
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api';

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch events');
  }
};
