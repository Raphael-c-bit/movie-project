import api from './auth';

export const getWatchlists = () => api.get('/watchlists');
export const getWatchlist = (id) => api.get(`/watchlists/${id}`);
export const createWatchlist = (name) => api.post('/watchlists', { name });
export const addToWatchlist = (watchlistId, movieId) => 
  api.post(`/watchlists/${watchlistId}/movies`, { movieId });