import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { getWatchlist, addToWatchlist } from '../api/watchlists';
import MovieGrid from '../components/MovieGrid';

const WatchlistPage = () => {
  const { id } = useParams();
  const [watchlist, setWatchlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await getWatchlist(id);
        setWatchlist(response.data);
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {watchlist?.name || 'Watchlist'}
      </Typography>
      
      {watchlist?.movies?.length > 0 ? (
        <MovieGrid movies={watchlist.movies} />
      ) : (
        <Typography>No movies in this watchlist yet</Typography>
      )}
    </Box>
  );
};

export default WatchlistPage;