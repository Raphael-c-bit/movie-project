import api from './auth';

export const getPopularMovies = () => api.get('/movies/popular');
export const searchMovies = (query) => api.get('/movies/search', { params: { query } });
export const getMovieDetails = (id) => api.get(`/movies/${id}`);
export const addFavorite = (movieId) => api.post('/movies/favorites', { movieId });
export const getMovieTrailers = (id) => api.get(`/movies/${id}/videos`);