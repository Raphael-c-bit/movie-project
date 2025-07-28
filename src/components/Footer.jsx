import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: 'background.paper',
        textAlign: 'center'
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Movie Recommendation App
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Data provided by <Link href="https://www.themoviedb.org/" target="_blank" rel="noopener">TMDb</Link>
      </Typography>
    </Box>
  );
};

export default Footer;