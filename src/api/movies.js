import { tmdbApi } from './tmdb';

export const getPopularMovies = () =>
  tmdbApi.get('/movie/popular'); // 

export const searchMovies = (query) =>
  tmdbApi.get('/search/movie', { params: { query, language: 'en-US', page: 1 } }); 

export const getMovieDetails = (id) =>
  tmdbApi.get(`/movie/${id}`, { params: { language: 'en-US' } }); 

export const getMovieTrailers = (id) =>
  tmdbApi.get(`/movie/${id}/videos`, { params: { language: 'en-US' } }); 

export const addFavorite = (movieId) =>
  tmdbApi.post('/movies/favorites', { movieId }); 
