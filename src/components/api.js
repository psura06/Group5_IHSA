import axios from 'axios';

const baseURL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: baseURL,
});

export const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch events');
  }
};

export default api;
