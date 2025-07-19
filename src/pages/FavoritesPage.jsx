import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFavorites } from '../api/users';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Button,
  CircularProgress,
  Box,
  IconButton
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavorites();
        setFavorites(response.data);
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
        Your Favorite Movies
      </Typography>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <FavoriteIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
          <Typography variant="h5" sx={{ mt: 2 }}>
            No favorites yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Start adding movies to your favorites!
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/" 
            sx={{ mt: 3 }}
          >
            Browse Movies
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {favorites.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  image={
                    movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : '/placeholder-movie.jpg'
                  }
                  alt={movie.title}
                  sx={{ height: 400, objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movie.release_date && movie.release_date.substring(0, 4)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/movie/${movie.id}`}
                  >
                    Details
                  </Button>
                  <IconButton aria-label="favorite" color="error">
                    <FavoriteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage;