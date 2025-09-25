//services/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // URL backend
  headers: {
    "Content-Type": "application/json",
    // "Content-Type": "application/x-www-form-urlencoded",
    // "Cache-Control": "no-cache, no-store, must-revalidate",
    // "Pragma": "no-cache",
    // "Expires": "0"
  },
});


// auto attach token to every request if exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`;
      config.headers.Authorization = `${token}`;
    }
    
    
    // config.headers['X-Requested-At'] = Date.now();
    
    
    // if (config.method === 'get') {
    //   config.params = {
    //     ...config.params,
    //     _t: Date.now()
    //   };
    // }
    
    return config;
});

export default api;