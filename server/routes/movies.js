const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Get popular movies
router.get('/popular', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
    res.json(response.data.results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Search movies
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`);
    res.json(response.data.results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get movie details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Save favorite movie (authenticated)
router.post('/favorites', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }
    
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get movie trailers
router.get('/:id/videos', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`
    );
    
    // Filter to only return trailers (exclude teasers, behind-the-scenes, etc.)
    const trailers = response.data.results.filter(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    res.json(trailers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;