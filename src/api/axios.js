import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.1.117:5000/api', // Ensure this matches your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
