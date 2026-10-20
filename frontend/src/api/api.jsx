import axios from 'axios';

const api = axios.create({
  // Vite proxies /api to Laravel in local development.  This keeps browser
  // requests same-origin and avoids CORS failures from development servers.
  // Set VITE_API_URL for a deployed frontend with a separate API host.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  const isAuthRequest =
    config.url === '/login' ||
    config.url === '/register';

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

export default api;
