import { Card, CardMedia, CardContent, Typography, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addFavorite } from '../api/movies';


const MovieCard = ({ movie }) => {
  const { isAuthenticated } = useAuth();

  const handleAddFavorite = async () => {
    try {
      await addFavorite(movie.id);
      // Show success message or update state
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <CardMedia
        component="img"
        height="400"
        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.release_date} • {movie.vote_average}/10
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/movie/${movie.id}`}>
          Details
        </Button>
        {isAuthenticated && (
          <Button size="small" onClick={handleAddFavorite}>
            Add to Favorites
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default MovieCard;