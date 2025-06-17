import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Chip,
  Avatar,
  IconButton,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import PersonIcon from '@mui/icons-material/Person';
import CarRentalIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Types importés depuis le store
import { RootState } from '../../../redux/store';
import { fetchClients } from '../../../redux/features/clients/customersSlice';
import { fetchVehicles } from '../../../redux/features/vehicle/vehiclesSlice';
import { fetchRegions } from '../../../redux/features/lieux/locationSlice';
import { deleteDevis, fetchDevisById } from '../../../redux/features/devis/devisSlice';
import { Customer } from '../../../types/clientDetail';
import { Vehicle } from '../../../redux/features/vehicle/vehiclesSlice';
import { Region } from '../../../types/region';
import { Devis } from '../../../redux/features/devis/devisSlice';
import { differenceInDays } from 'date-fns';
import { useAppDispatch } from '../../../hooks';

const DevisDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Local state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Redux state 
  const { selectedDevis, loading } = useSelector(
    (state: RootState) => state.devis
  );
  const clients = useSelector((state: RootState) => state.customer.clients);
  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);
  const regions = useSelector((state: RootState) => state.locations.regions);

  const devis = selectedDevis;

  // Local data
  const [client, setClient] = useState<Customer | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [duration, setDuration] = useState<number>(0);

  // Charger les données
  useEffect(() => {
    if (id && (!devis || devis.id !== id)) {
      dispatch(fetchDevisById(id));
    }
    if (!clients.length) dispatch(fetchClients());
    if (!vehicles.length) dispatch(fetchVehicles());
    if (!regions.length) dispatch(fetchRegions());
  }, [dispatch, id, devis]);

  // Mettre à jour les données quand le devis change
  useEffect(() => {
    if (!devis) return;

    const item = devis.items[0];
    if (!item) return;

    const c = clients.find((cl) => cl.id === devis.clientId);
    const v = vehicles.find((ve) => ve.id === item.vehiculeId);
    const r = regions.find((re) => re.id === item.regionId);
    const days = Math.max(differenceInDays(new Date(devis.endDate), new Date(devis.startDate)), 0);

    setClient(c || null);
    setVehicle(v || null);
    setRegion(r || null);
    setDuration(days);
  }, [devis, clients, vehicles, regions]);

  // Handlers
  const handleDelete = () => {
    if (!devis?.id) return;
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      dispatch(deleteDevis(devis.id));
      setSnackbar({
        open: true,
        message: 'Devis supprimé avec succès.',
        severity: 'success',
      });
      setTimeout(() => navigate('/devis'), 1000);
    }
  };

  const handleEdit = () => {
    navigate(`/quote?edit=${devis?.id}`);
  };

  const handlePrint = () => {
    window.alert(`Impression du devis #${devis?.id}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString('fr-FR');

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading && !devis) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Chargement en cours...</Typography>
        </Paper>
      </Container>
    );
  }

  if (!devis) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Aucun devis trouvé.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Détails du Devis #{devis.id}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Modifier
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            sx={{ mr: 1 }}
          >
            Supprimer
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Imprimer
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Informations générales */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader title="Informations générales" />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <DateRangeIcon />
                  </Avatar>
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      Créé le
                    </Typography>
                    <Typography variant="body1">{formatDate(devis.createdAt)}</Typography>
                  </div>
                </Box>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <DateRangeIcon />
                  </Avatar>
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      Période de location
                    </Typography>
                    <Typography variant="body1">
                      Du {formatDate(devis.startDate)} au {formatDate(devis.endDate)}
                    </Typography>
                  </div>
                </Box>
                <Box display="flex" alignItems="center">
                  <Chip
                    label={devis.status}
                    color={getStatusColor(devis.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Informations client */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader title="Client" />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      Nom
                    </Typography>
                    <Typography variant="body1">{client?.lastName || 'Inconnu'}</Typography>
                  </div>
                </Box>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{client?.email || '-'}</Typography>
                  </div>
                </Box>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      Téléphone
                    </Typography>
                    <Typography variant="body1">{client?.phone || '-'}</Typography>
                  </div>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Véhicule */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader title="Véhicule" />
            <Divider />
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <CarRentalIcon />
                </Avatar>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Modèle
                  </Typography>
                  <Typography variant="body1">
                    {vehicle?.marque} {vehicle?.modele}
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Destination */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader title="Destination" />
            <Divider />
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <LocationOnIcon />
                </Avatar>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Région
                  </Typography>
                  <Typography variant="body1">
                    {region?.nom_region || 'Inconnue'}
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Prix */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader title="Prix" />
            <Divider />
            <CardContent>
              <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={1}>
                <Typography variant="body1">
                  Base ({region?.prix.prix.toLocaleString()} Ar x {duration} jours)
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {((region?.prix?.prix ?? 0) * duration).toLocaleString()} Ar
                </Typography>
              </Box>
              {devis.includesFuel && (
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="body1">Carburant</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {devis.fuelCostPerDay
                      ? (devis.fuelCostPerDay * duration).toLocaleString()
                      : 'Estimé'}{' '}
                    Ar
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {devis.totalAmount.toLocaleString()} Ar
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DevisDetailsPage;