import { useState, useEffect } from 'react';
import { getPopularMovies, searchMovies } from '../api/movies';
import { Grid, Container, Typography } from '@mui/material';
import { MovieCard, SearchBar } from '../components';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getPopularMovies();
        setMovies(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const response = await searchMovies(query);
      setMovies(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <SearchBar onSearch={handleSearch} />
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Popular Movies
      </Typography>
      <Grid container spacing={4}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;