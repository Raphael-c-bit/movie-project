import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getMovieTrailers, addFavorite } from '../api/movies';
import { useAuth } from '../context/AuthContext';
import { 
  Container, 
  Typography, 
  Box, 
  Chip, 
  CircularProgress, 
  Button,
  Grid,
  Rating,
  Divider,
  IconButton,
  Dialog,
  DialogContent
} from '@mui/material';
import YouTube from 'react-youtube';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';

const MovieDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [detailsResponse, trailersResponse] = await Promise.all([
          getMovieDetails(id),
          getMovieTrailers(id)
        ]);
        
        setMovie(detailsResponse.data);
        setTrailers(trailersResponse.data.filter(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        ));
        
        // Check if movie is in favorites (you'll need to implement this)
        // setIsFavorite(favorites.includes(id));
      } catch (err) {
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleAddFavorite = async () => {
    try {
      await addFavorite(id);
      setIsFavorite(true);
      // Add toast notification here if desired
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4">Movie not found</Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Poster */}
        <Grid item xs={12} md={4}>
          <Box
            component="img"
            src={
              movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/placeholder-movie.jpg'
            }
            alt={movie.title}
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
          
          {isAuthenticated && (
            <Button
              fullWidth
              variant="contained"
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              sx={{ mt: 2 }}
              onClick={handleAddFavorite}
              disabled={isFavorite}
            >
              {isFavorite ? 'In Your Favorites' : 'Add to Favorites'}
            </Button>
          )}
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" component="h1" gutterBottom>
            {movie.title} 
            {movie.release_date && (
              <Typography 
                component="span" 
                variant="h5" 
                color="text.secondary" 
                sx={{ ml: 2 }}
              >
                ({new Date(movie.release_date).getFullYear()})
              </Typography>
            )}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating 
              value={movie.vote_average / 2} 
              precision={0.1} 
              readOnly 
              size="large"
            />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {movie.vote_average.toFixed(1)}/10 ({movie.vote_count.toLocaleString()} votes)
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            {movie.genres?.map(genre => (
              <Chip 
                key={genre.id} 
                label={genre.name} 
                sx={{ mr: 1, mb: 1 }} 
                component={Link}
                to={`/movies?genre=${genre.id}`}
                clickable
              />
            ))}
          </Box>

          {movie.tagline && (
            <Typography variant="h6" fontStyle="italic" color="text.secondary" gutterBottom>
              "{movie.tagline}"
            </Typography>
          )}

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Overview
          </Typography>
          <Typography paragraph>
            {movie.overview || 'No overview available.'}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
            {movie.release_date && (
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2">Release Date</Typography>
                <Typography>{formatDate(movie.release_date)}</Typography>
              </Grid>
            )}
            {movie.runtime && (
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2">Runtime</Typography>
                <Typography>{formatRuntime(movie.runtime)}</Typography>
              </Grid>
            )}
            {movie.budget && movie.budget > 0 && (
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2">Budget</Typography>
                <Typography>${movie.budget.toLocaleString()}</Typography>
              </Grid>
            )}
            {movie.revenue && movie.revenue > 0 && (
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2">Revenue</Typography>
                <Typography>${movie.revenue.toLocaleString()}</Typography>
              </Grid>
            )}
            {movie.status && (
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2">Status</Typography>
                <Typography>{movie.status}</Typography>
              </Grid>
            )}
          </Grid>

          {/* Trailers Section */}
          {trailers.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" gutterBottom>
                Trailers
              </Typography>
              <Grid container spacing={2}>
                {trailers.slice(0, 3).map(trailer => (
                  <Grid item xs={12} sm={6} md={4} key={trailer.key}>
                    <Box
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.9 },
                        position: 'relative',
                        pt: '56.25%', // 16:9 aspect ratio
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                      }}
                      onClick={() => {
                        setSelectedTrailer(trailer);
                        setOpenTrailer(true);
                      }}
                    >
                      <Box
                        component="img"
                        src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                        alt={trailer.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'white',
                          fontSize: 48,
                        }}
                      >
                        ▶
                      </Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          p: 1,
                          textAlign: 'center',
                        }}
                      >
                        {trailer.name}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>

      {/* Trailer Dialog */}
      <Dialog
        open={openTrailer}
        onClose={() => setOpenTrailer(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <IconButton
            aria-label="close"
            onClick={() => setOpenTrailer(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedTrailer && (
            <YouTube
              videoId={selectedTrailer.key}
              opts={{
                width: '100%',
                height: '500',
                playerVars: {
                  autoplay: 1,
                  modestbranding: 1,
                  rel: 0,
                },
              }}
              style={{
                width: '100%',
                aspectRatio: '16/9',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MovieDetailPage;