// src/Api/axios.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4000/api', // or your deployed API base
});

// ✅ Automatically include token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
