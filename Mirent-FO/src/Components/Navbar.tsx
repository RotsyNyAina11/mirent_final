import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DirectionsCarIcon sx={{ color: '#1976d2', mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#1976d2',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            MIRENT
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/vehicules"
              sx={{ color: '#333' }}
            >
              Nos Véhicules
            </Button>
            <Button
              component={Link}
              to="/services"
              sx={{ color: '#333' }}
            >
              Services
            </Button>
            <Button
              component={Link}
              to="/contact"
              sx={{ color: '#333' }}
            >
              Contact
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              Connexion
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;