import axios from 'axios';
import { supabase } from '../config/supabase';

const apiClient = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:5000/api`, // api shall be on the same server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
