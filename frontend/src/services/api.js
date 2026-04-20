import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;  //use (const API_URL = 'http://127.0.0.1:8000';) to run the application locally

const api = axios.create({
  baseURL: API_URL,
});


// This interceptor automatically adds the JWT token to every request 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
