import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.56.56:5000/api', // Ensure this matches your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
