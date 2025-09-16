//services/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000', // URL backend với fallback
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // timeout sau 10s
});


// Xử lý trước khi gửi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Xử lý token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;