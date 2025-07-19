import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api/users';
import { Container, Typography, Box, Avatar, Button } from '@mui/material';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 100, height: 100, mr: 3 }}>
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4">{user?.username}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>

      {profile && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Account Details
          </Typography>
          <Typography>Member since: {new Date(profile.createdAt).toLocaleDateString()}</Typography>
          <Typography>Favorite Movies: {profile.favorites?.length || 0}</Typography>
        </Box>
      )}

      <Button
        variant="contained"
        color="error"
        sx={{ mt: 4 }}
        onClick={logout}
      >
        Logout
      </Button>
    </Container>
  );
};

export default ProfilePage;