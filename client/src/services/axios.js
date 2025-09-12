//services/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // URL backend
  headers: {
    "Content-Type": "application/json",
  },
});


// auto attach token to every request if exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;