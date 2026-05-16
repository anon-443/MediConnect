import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => { accessToken = token; };
export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        setAccessToken(res.data.access_token);
        original.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(original);
      } catch {
        setAccessToken(null);
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
