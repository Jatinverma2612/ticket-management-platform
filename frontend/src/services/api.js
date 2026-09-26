import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: token expired or invalid
      // We don't automatically wipe localStorage here to allow AuthContext to handle graceful cleanup
    }
    return Promise.reject(error);
  }
);

export default api;
