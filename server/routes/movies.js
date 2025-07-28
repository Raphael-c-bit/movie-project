require('dotenv').config(); 
const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = '2b40951bf9cbc7fc6eb52577b11955d9'; 

// Centralized error handler
const handleApiError = (err, res) => {
  console.error('API Error:', err.message);
  if (err.response) {
    console.error('Status:', err.response.status);
    console.error('Data:', err.response.data);
    return res.status(err.response.status).json({
      error: err.response.data.status_message || 'TMDB API Error'
    });
  }
  res.status(500).json({ error: 'Internal server error' });
};

// Get popular movies (fixed endpoint)
router.get('/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    res.json({
      results: response.data.results,
      page: response.data.page,
      totalPages: response.data.total_pages
    });
  } catch (err) {
    handleApiError(err, res);
  }
});

// Search movies (with URL encoding)
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter required' });
    
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    res.json(response.data.results);
  } catch (err) {
    handleApiError(err, res);
  }
});

// Get movie details (with append_to_response)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
    );
    res.json(response.data);
  } catch (err) {
    handleApiError(err, res);
  }
});

// Save favorite movie (with duplicate check)
router.post('/favorites', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
      return res.json({ 
        success: true,
        favorites: user.favorites
      });
    }
    
    res.status(400).json({ 
      error: 'Movie already in favorites',
      favorites: user.favorites
    });
  } catch (err) {
    handleApiError(err, res);
  }
});

// Get movie trailers (improved filtering)
router.get('/:id/videos', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`
    );
    
    const trailers = response.data.results
      .filter(video => video.type === 'Trailer')
      .sort((a, b) => (b.size > a.size) ? 1 : -1); // Prefer higher resolution
    
    res.json({
      trailers,
      youtubeLinks: trailers.map(t => `https://www.youtube.com/watch?v=${t.key}`)
    });
  } catch (err) {
    handleApiError(err, res);
  }
});

module.exports = router;