import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register data:', formData);
    // Add your registration logic here
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
      <Typography sx={{ mt: 2 }}>
        Already have an account? <Link to="/login">Login here</Link>
      </Typography>
    </Container>
  );
};

export default RegisterPage;