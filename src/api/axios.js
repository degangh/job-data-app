import axios from 'axios';
import { supabase } from '../config/supabase';

const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl);
const apiClient = axios.create({
  baseURL: apiUrl, 
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
