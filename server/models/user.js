const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  watchlists: [{
    name: String,
    movies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    }]
    }],
    followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    }],
    following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);