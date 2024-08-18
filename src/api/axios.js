import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:5000/api`, // api shall be on the same server
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
