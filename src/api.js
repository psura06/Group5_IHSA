import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch events');
  }
};
