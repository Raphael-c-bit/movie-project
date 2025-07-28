import api from './auth';

export const getProfile = () => api.get('/users/me');
export const updateProfile = (userData) => api.put('/users/me', userData);
export const getFavorites = () => api.get('/users/favorites');
export const login = (userData) => api.post('/auth/login', userData);