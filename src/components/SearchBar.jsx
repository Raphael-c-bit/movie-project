import { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton,
  Box 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 600 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: query && (
            <IconButton onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;