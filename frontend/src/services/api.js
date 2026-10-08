import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
});

// Attach Supabase JWT for admin requests
api.interceptors.request.use((config) => {
  const session = localStorage.getItem('sb-session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      const token = parsed?.access_token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (_) {}
  }
  return config;
});

// Public endpoints
export const getSettings = () => api.get('/settings').then((r) => r.data.data);
export const getPrograms = () => api.get('/programs').then((r) => r.data.data);
export const getCurrentProgram = () => api.get('/programs/current').then((r) => r.data.data);
export const getGallery = (params) => api.get('/gallery', { params }).then((r) => r.data);
export const submitContact = (payload) => api.post('/contact', payload).then((r) => r.data);

// Admin endpoints
export const adminDashboard = () => api.get('/admin/dashboard').then((r) => r.data.data);
export const adminMessages = () => api.get('/admin/messages').then((r) => r.data.data);

export const adminUploadImage = (formData) =>
  api.post('/admin/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const adminUpdateImage = (id, body) => api.patch(`/admin/gallery/${id}`, body).then((r) => r.data);
export const adminDeleteImage = (id) => api.delete(`/admin/gallery/${id}`).then((r) => r.data);

export const adminCreateProgram = (body) => api.post('/admin/programs', body).then((r) => r.data);
export const adminUpdateProgram = (id, body) => api.patch(`/admin/programs/${id}`, body).then((r) => r.data);
export const adminDeleteProgram = (id) => api.delete(`/admin/programs/${id}`).then((r) => r.data);

export const adminCreateActivity = (body) => api.post('/admin/activities', body).then((r) => r.data);
export const adminUpdateActivity = (id, body) => api.patch(`/admin/activities/${id}`, body).then((r) => r.data);
export const adminDeleteActivity = (id) => api.delete(`/admin/activities/${id}`).then((r) => r.data);

export const adminUpdateSettings = (body) => api.patch('/admin/settings', body).then((r) => r.data);
export const adminUploadSettingsImage = (formData) =>
  api
    .post('/admin/settings/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);

export default api;
