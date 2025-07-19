import { useState, useEffect } from 'react';
import { getMovieTrailers } from '../api/movies';
import { Dialog, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import YouTube from 'react-youtube';

const MovieTrailer = ({ movieId }) => {
  const [trailers, setTrailers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const response = await getMovieTrailers(movieId);
        setTrailers(response.data);
      } catch (err) {
        console.error('Failed to fetch trailers:', err);
      }
    };
    
    if (movieId) fetchTrailers();
  }, [movieId]);

  if (trailers.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Trailers
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {trailers.map((trailer) => (
          <Box
            key={trailer.key}
            sx={{
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={() => {
              setSelectedTrailer(trailer);
              setOpen(true);
            }}
          >
            <img
              src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
              alt={trailer.name}
              width="200"
            />
            <Typography variant="body2">{trailer.name}</Typography>
          </Box>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
        <DialogContent>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedTrailer && (
            <YouTube
              videoId={selectedTrailer.key}
              opts={{
                width: '800',
                height: '450',
                playerVars: { autoplay: 1 },
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MovieTrailer;