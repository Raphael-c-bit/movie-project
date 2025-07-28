// client/src/components/MovieFilters.jsx
import { useState } from 'react';
import { 
  Box, 
  Slider, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const MovieFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    rating: [0, 10],
    year: null,
    sortBy: 'popularity'
  });

  const handleChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Filter Movies</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ width: 300 }}>
          <Typography gutterBottom>Rating Range</Typography>
          <Slider
            value={filters.rating}
            onChange={(e, newValue) => handleChange('rating', newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10}
            step={0.1}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Chip label={`Min: ${filters.rating[0]}`} size="small" />
            <Chip label={`Max: ${filters.rating[1]}`} size="small" />
          </Box>
        </Box>

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => handleChange('sortBy', e.target.value)}
            >
              <MenuItem value="popularity">Popularity</MenuItem>
              <MenuItem value="release_date">Release Date</MenuItem>
              <MenuItem value="vote_average">Rating</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <DatePicker
          label="Release Year"
          views={['year']}
          value={filters.year}
          onChange={(newValue) => handleChange('year', newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </Box>
  );
};

export default MovieFilters;