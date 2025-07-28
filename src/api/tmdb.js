import axios from 'axios';

const TMDB_BEARER = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjNhOTYyYjM2ZDFhMGNmZTE3OGU5YTY1OGZlNTA5NyIsIm5iZiI6MTc0NjQ0ODM1NC4zOTUsInN1YiI6IjY4MThhZmUyMTdkMTM1MTcwNTA4YTVjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GYHt7WG7NLb2XeU1EuIBwAJ_9yEsfmpTQuC0lNmPuA0'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_BEARER}`,
  },
});


export const getPopularMovies = () =>
  tmdbApi.get('/movie/popular', {
    params: {
      language: 'en-US',
      page: 1,
    },
  });

export const searchMovies = (query) =>
  tmdbApi.get('/search/movie', {
    params: {
      query,
      language: 'en-US',
      page: 1,
    },
  });

export const getMovieDetails = (id) =>
  tmdbApi.get(`/movie/${id}`, {
    params: {
      language: 'en-US',
    },
  });