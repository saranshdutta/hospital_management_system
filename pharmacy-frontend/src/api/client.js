import axios from 'axios';

// With Vite proxy configured, use relative base so it works in both
// dev (proxy → localhost:8000) and production (same-origin deployment).
const client = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('pharmacy_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear storage and redirect to login
      localStorage.removeItem('pharmacy_token');
      localStorage.removeItem('pharmacy_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
