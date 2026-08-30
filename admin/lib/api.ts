import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://iwklappbackend-production.up.railway.app/api';

const api = axios.create({
  baseURL: apiUrl,
});

// Commented out auth for now - to be re-enabled after proper setup
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
