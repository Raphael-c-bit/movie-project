// server/routes/watchlists.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');

// Create watchlist
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const watchlist = new Watchlist({
      name,
      user: req.userId,
      movies: []
    });
    await watchlist.save();
    res.status(201).json(watchlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's watchlists
router.get('/', auth, async (req, res) => {
  try {
    const watchlists = await Watchlist.find({ user: req.userId });
    res.json(watchlists);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add movie to watchlist
router.post('/:id/movies', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    
    if (!watchlist.movies.includes(req.body.movieId)) {
      watchlist.movies.push(req.body.movieId);
      await watchlist.save();
    }
    
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;