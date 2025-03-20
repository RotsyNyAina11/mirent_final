import React from 'react';
import { Container } from '@mui/material';
import LocationList from '../../Components/lieux/locationList';

const LocationsPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <LocationList />
    </Container>
  );
};

export default LocationsPage;