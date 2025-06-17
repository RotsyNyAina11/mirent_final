import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  DialogTitle,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { differenceInDays, format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { fetchVehicles } from '../../../redux/features/vehicle/vehiclesSlice';
import { fetchRegions } from '../../../redux/features/lieux/locationSlice';
import { addClient, fetchClients } from '../../../redux/features/clients/customersSlice';
import { createDevis, CreateDevisDto, fetchDevis } from '../../../redux/features/devis/devisSlice';
import QuotePreviewDialog from '../../Components/Quote/quoteDialog';

// Extend the Window interface to include html2canvas and jspdf
declare global {
  interface Window {
    html2canvas?: any;
    jspdf?: any;
  }
}

// Interfaces
interface Client {
  id: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
}

interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  immatriculation: string;
  nombrePlace: number;
  imageUrl: string;
  type: { id: number; type: string };
  status: { id: number; status: string };
}

// Custom Material-UI theme
const theme = createTheme({
  palette: {
    primary: { main: '#2a52be' },
    secondary: { main: '#dc004e' },
    success: { main: '#2e7d32' },
    info: { main: '#03a9f4' },
    warning: { main: '#ff9800' },
    error: { main: '#f44336' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    body1: { fontSize: '0.95rem', color: '#333' },
    caption: { fontSize: '0.75rem', color: '#555' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: '8px', textTransform: 'none' } } },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: '8px', boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.12)' } },
    },
  },
});

const QuoteForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vehicles, vehiclesLoading, vehiclesError } = useSelector(
    (state: RootState) => state.vehicles
  );
  const { regions, status: regionsStatus, error: regionsError } = useSelector(
    (state: RootState) => state.locations
  );
  const { clients, loading: clientsLoading, error: clientsError } = useSelector(
    (state: RootState) => state.customer
  );
  const { devis, loading: devisLoading, error: devisError } = useSelector(
    (state: RootState) => state.devis
  );

  // State variables
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [openClientDialog, setOpenClientDialog] = useState<boolean>(false);
  const [newClient, setNewClient] = useState<Client>({
    id: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [quoteDate, setQuoteDate] = useState<Date | null>(new Date());
  const [expirationDate, setExpirationDate] = useState<Date | null>(addDays(new Date(), 30));
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [withFuel, setWithFuel] = useState<boolean>(false);
  const [estimatedFuelPrice, setEstimatedFuelPrice] = useState<number>(0);
  const [finalTotalPrice, setFinalTotalPrice] = useState<number>(0);
  const [quoteNumber, setQuoteNumber] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');
  const previewContentRef = useRef<HTMLDivElement>(null);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchRegions());
    dispatch(fetchClients());
    dispatch(fetchDevis());
    setQuoteNumber(`DEV${Date.now().toString().slice(-6)}`);
  }, [dispatch]);

  // Calculate duration
  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate);
      setDuration(days > 0 ? days : 0);
    } else {
      setDuration(0);
    }
  }, [startDate, endDate]);

  // Calculate base price
  useEffect(() => {
    let calculatedBasePrice = 0;
    const region = regions.find((r) => r.id === Number(selectedDestination));
    if (region && duration > 0) {
      calculatedBasePrice += region.prix.prix * duration;
    }
    setBasePrice(calculatedBasePrice);
  }, [duration, selectedDestination, regions]);

  // Calculate final total price
  useEffect(() => {
    let total = basePrice;
    if (withFuel) {
      total += estimatedFuelPrice;
    }
    setFinalTotalPrice(total);
  }, [basePrice, withFuel, estimatedFuelPrice]);

  // Load external scripts
  useEffect(() => {
    const loadScript = (src: string, id: string, onload: () => void) => {
      if (document.getElementById(id)) {
        onload();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.onload = onload;
      document.body.appendChild(script);
    };
    let html2canvasLoaded = false;
    let jspdfLoaded = false;
    const checkAllLoaded = () => {
      if (html2canvasLoaded && jspdfLoaded) {
        console.log('html2canvas and jspdf loaded.');
      }
    };
    loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
      'html2canvas-script',
      () => {
        html2canvasLoaded = true;
        checkAllLoaded();
      }
    );
    loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
      'jspdf-script',
      () => {
        jspdfLoaded = true;
        checkAllLoaded();
      }
    );
  }, []);

  // Handler for saving a new client
  const handleSaveClient = async () => {
    if (!newClient.lastName || !newClient.email || !newClient.phone) {
      setSnackbarMessage('Veuillez remplir tous les champs du client.');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
    try {
      const resultAction = await dispatch(
        addClient({
          lastName: newClient.lastName,
          email: newClient.email,
          phone: newClient.phone,
          logo: '',
        })
      );
      if (addClient.fulfilled.match(resultAction)) {
        setSelectedClientId(resultAction.payload.id.toString());
        setOpenClientDialog(false);
        setNewClient({ id: '', lastName: '', email: '', phone: '' });
        setSnackbarMessage('Client ajouté avec succès !');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(
          resultAction.payload as string || "Erreur lors de l'enregistrement du client."
        );
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Erreur lors de l'enregistrement du client.");
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Handler for form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !selectedClientId ||
      !startDate ||
      !endDate ||
      !selectedVehicle ||
      !selectedDestination ||
      !expirationDate
    ) {
      setSnackbarMessage('Veuillez remplir tous les champs obligatoires.');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
    console.log("----------------------------------------");
    console.log(selectedClientId, Number(selectedClientId));
    console.log(selectedVehicle, Number(selectedVehicle));
    console.log(selectedDestination, Number(selectedDestination));
    console.log(startDate, format(startDate, 'yyyy-MM-dd'));
    console.log(endDate, format(endDate, 'yyyy-MM-dd'));
    

    const devisData: CreateDevisDto = {
      clientId: Number(selectedClientId),
      items: [
        {
          quantity: 1,
          regionId: Number(selectedDestination),
          vehiculeId: Number(selectedVehicle),
        },
      ],
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      includesFuel: withFuel,
      fuelCostPerDay: withFuel ? estimatedFuelPrice / duration : undefined,
    };
    console.log("Final devisData payload: ", devisData);

    try {
      const resultAction = await dispatch(createDevis(devisData));
      if (createDevis.fulfilled.match(resultAction)) {
        setSnackbarMessage('Devis créé avec succès !');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setSelectedClientId('');
        setStartDate(null);
        setEndDate(null);
        setSelectedVehicle('');
        setSelectedDestination('');
        setWithFuel(false);
        setEstimatedFuelPrice(0);
        setQuoteNumber(`DEV${Date.now().toString().slice(-6)}`);
      } else {
        setSnackbarMessage(
          resultAction.payload as string || 'Erreur lors de la création du devis.'
        );
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Erreur lors de la création du devis.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCreateAndPrint = async () => {
    if (
      !selectedClientId ||
      !startDate ||
      !endDate ||
      !selectedVehicle ||
      !selectedDestination ||
      !expirationDate
    ) {
      setSnackbarMessage(
        'Veuillez remplir tous les champs obligatoires, y compris la sélection du client et la date d\'expiration, avant de créer et d\'imprimer le devis.'
      );
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
    setShowPreview(true);
    setTimeout(() => {
      generatePdf();
      handleClosePreview();
    }, 500);
  };

  const handlePrint = () => {
    handlePreview();
    setTimeout(() => {
      generatePdf();
      handleClosePreview();
    }, 500);
  };

  const handleConfirm = () => {
    setSnackbarMessage('Fonctionnalité Confirmer en cours de développement.');
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };

  const handlePreview = () => {
    if (
      !selectedClientId ||
      !startDate ||
      !endDate ||
      !selectedVehicle ||
      !selectedDestination ||
      !expirationDate
    ) {
      setSnackbarMessage(
        'Veuillez remplir tous les champs obligatoires, y compris la sélection du client et la date d\'expiration, avant de prévisualiser le devis.'
      );
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleOpenClientDialog = () => {
    setOpenClientDialog(true);
  };

  const handleCloseClientDialog = () => {
    setOpenClientDialog(false);
    setNewClient({ id: '', lastName: '', email: '', phone: '' });
  };

  const handleCancel = () => {
    console.log('Fonctionnalité Annuler en cours de développement.');
    setSelectedClientId('');
    setQuoteDate(new Date());
    setExpirationDate(addDays(new Date(), 30));
    setStartDate(null);
    setEndDate(null);
    setDuration(0);
    setSelectedVehicle('');
    setSelectedDestination('');
    setEstimatedFuelPrice(0);
    setWithFuel(false);
    setQuoteNumber(`DEV${Date.now().toString().slice(-6)}`);
    setSnackbarMessage('Formulaire annulé et réinitialisé.');
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const generatePdf = async () => {
    if (!window.html2canvas || !window.jspdf) {
      setSnackbarMessage('Les bibliothèques de PDF ne sont pas encore chargées. Veuillez réessayer.');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
    if (!previewContentRef.current) {
      setSnackbarMessage('Contenu de prévisualisation introuvable pour la génération de PDF.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    setSnackbarMessage('Génération du PDF en cours...');
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
    const dialogContent = previewContentRef.current;
    const originalStyles = {
      height: dialogContent.style.height,
      overflow: dialogContent.style.overflow,
      maxHeight: dialogContent.style.maxHeight,
      position: dialogContent.style.position,
    };
    try {
      dialogContent.style.height = 'auto';
      dialogContent.style.overflow = 'visible';
      dialogContent.style.maxHeight = 'none';
      dialogContent.style.position = 'relative';
      const canvas = await window.html2canvas(dialogContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: dialogContent.scrollWidth,
        windowHeight: dialogContent.scrollHeight,
      });
      for (const prop in originalStyles) {
        dialogContent.style[prop as keyof typeof originalStyles] =
          originalStyles[prop as keyof typeof originalStyles];
      }
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const selectedClient = clients.find((c) => c.id === Number(selectedClientId));
      const clientNameForFile = selectedClient
        ? selectedClient.lastName.replace(/\s/g, '_')
        : 'client';
      pdf.save(`Devis_${clientNameForFile}_${quoteNumber}.pdf`);
      setSnackbarMessage('PDF généré avec succès !');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      setSnackbarMessage('Erreur lors de la génération du PDF. Veuillez réessayer.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      for (const prop in originalStyles) {
        dialogContent.style[prop as keyof typeof originalStyles] =
          originalStyles[prop as keyof typeof originalStyles];
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
          }}
        >
          {clientsLoading && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.info.main }}>
              Chargement des clients...
            </Typography>
          )}
          {clientsError && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.error.main }}>
              Erreur: {clientsError}
            </Typography>
          )}
          {vehiclesLoading && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.info.main }}>
              Chargement des véhicules...
            </Typography>
          )}
          {vehiclesError && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.error.main }}>
              Erreur: {vehiclesError}
            </Typography>
          )}
          {regionsStatus === 'loading' && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.info.main }}>
              Chargement des régions...
            </Typography>
          )}
          {regionsError && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.error.main }}>
              Erreur: {regionsError}
            </Typography>
          )}
          {devisLoading && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.info.main }}>
              Chargement des devis...
            </Typography>
          )}
          {devisError && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.error.main }}>
              Erreur: {devisError}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Button variant="outlined" color="info" onClick={handlePreview}>
              Aperçu
            </Button>
            <Button variant="contained" color="success" onClick={handleConfirm}>
              Confirmer
            </Button>
            <Button variant="contained" color="primary" onClick={handlePrint}>
              Imprimer
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Annuler
            </Button>
          </Box>
          <Paper
            elevation={6}
            sx={{ p: 5, maxWidth: 900, margin: 'auto', borderRadius: '12px' }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  N° Devis:{' '}
                  <strong style={{ color: theme.palette.primary.main }}>
                    {quoteNumber}
                  </strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h4"
                  gutterBottom
                  align="right"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Devis de location de véhicule
                </Typography>
              </Grid>
            </Grid>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={{ mb: 4, color: theme.palette.primary.dark }}
            >
              Détails du Devis
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required
                    variant="outlined"
                    disabled={clientsLoading}
                  >
                    <InputLabel id="client-select-label">Sélectionnez un client</InputLabel>
                    <Select
                      labelId="client-select-label"
                      value={selectedClientId}
                      label="Sélectionnez un client"
                      onChange={(e) => setSelectedClientId(e.target.value as string)}
                    >
                      <MenuItem value="">
                        <em>Sélectionner un client</em>
                      </MenuItem>
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.lastName}
                        </MenuItem>
                      ))}
                      <MenuItem value="new">Créer un nouveau client</MenuItem>
                    </Select>
                  </FormControl>
                  {selectedClientId === 'new' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenClientDialog}
                      sx={{ mt: 2 }}
                    >
                      Ajouter un nouveau client
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date du devis"
                    value={quoteDate}
                    onChange={(newValue) =>
                      setQuoteDate(newValue ? new Date(newValue as any) : null)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        InputProps: { readOnly: true },
                        variant: 'outlined',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date d'expiration du devis"
                    value={expirationDate}
                    onChange={(newValue) =>
                      setExpirationDate(newValue ? new Date(newValue as any) : null)
                    }
                    minDate={quoteDate || new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: 'outlined',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de début de location"
                    value={startDate}
                    onChange={(newValue) =>
                      setStartDate(newValue ? new Date(newValue as any) : null)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: 'outlined',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de fin de location"
                    value={endDate}
                    onChange={(newValue) =>
                      setEndDate(newValue ? new Date(newValue as any) : null)
                    }
                    minDate={startDate || undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: 'outlined',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Durée (Jours)"
                    value={duration}
                    InputProps={{ readOnly: true }}
                    variant="filled"
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel id="vehicle-select-label">Sélectionnez un véhicule</InputLabel>
                    <Select
                      labelId="vehicle-select-label"
                      value={selectedVehicle}
                      label="Sélectionnez un véhicule"
                      onChange={(e) => setSelectedVehicle(e.target.value as string)}
                    >
                      <MenuItem value="">
                        <em>Sélectionner un véhicule</em>
                      </MenuItem>
                      {vehicles.map((vehicle) => (
                        <MenuItem key={vehicle.id} value={vehicle.id.toString()}>
                          {`${vehicle.nom} (${vehicle.marque} ${vehicle.modele})`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel id="destination-select-label">
                      Sélectionnez une destination
                    </InputLabel>
                    <Select
                      labelId="destination-select-label"
                      value={selectedDestination}
                      label="Sélectionnez une destination"
                      onChange={(e) => setSelectedDestination(e.target.value as string)}
                    >
                      <MenuItem value="">
                        <em>Sélectionner une destination</em>
                      </MenuItem>
                      {regions.map((region) => (
                        <MenuItem key={region.id} value={region.id.toString()}>
                          {region.nom_region} ({region.prix.prix} Ar)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Option Carburant</FormLabel>
                    <RadioGroup
                      row
                      aria-label="withFuel"
                      name="row-radio-buttons-group"
                      value={withFuel ? 'yes' : 'no'}
                      onChange={(e) => {
                        setWithFuel(e.target.value === 'yes');
                        if (e.target.value === 'no') {
                          setEstimatedFuelPrice(0);
                        }
                      }}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Avec Carburant"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="Sans Carburant"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {withFuel && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Prix estimatif du carburant ($)"
                      type="number"
                      value={estimatedFuelPrice === 0 ? '' : estimatedFuelPrice}
                      onChange={(e) => setEstimatedFuelPrice(Number(e.target.value))}
                      inputProps={{ min: 0 }}
                      variant="outlined"
                      required={withFuel}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    align="right"
                    sx={{ mt: 1, mb: 1, color: 'text.secondary' }}
                  >
                    Prix de base: {basePrice.toFixed(2)} Ar
                  </Typography>
                  {withFuel && (
                    <Typography
                      variant="h6"
                      align="right"
                      sx={{ mb: 1, color: 'text.secondary' }}
                    >
                      Carburant estimatif: {estimatedFuelPrice.toFixed(2)} Ar
                    </Typography>
                  )}
                  <Typography
                    variant="h5"
                    align="right"
                    sx={{
                      mt: 3,
                      mb: 2,
                      fontWeight: 'bold',
                      color: theme.palette.secondary.main,
                    }}
                  >
                    Prix total final:{' '}
                    <span style={{ fontSize: '1.8rem', color: theme.palette.success.main }}>
                      {finalTotalPrice.toFixed(2)} Ar
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: '8px' }}
                  >
                    Créer
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          {/* New Client Dialog */}
          <Dialog open={openClientDialog} onClose={handleCloseClientDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Nom du client"
                  value={newClient.lastName}
                  onChange={(e) =>
                    setNewClient({ ...newClient, lastName: e.target.value })
                  }
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Numéro de téléphone"
                  value={newClient.phone}
                  onChange={(e) =>
                    setNewClient({ ...newClient, phone: e.target.value })
                  }
                  required
                  variant="outlined"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseClientDialog} color="primary" variant="outlined">
                Annuler
              </Button>
              <Button onClick={handleSaveClient} color="success" variant="contained">
                Enregistrer
              </Button>
            </DialogActions>
          </Dialog>
          {/* Quote Preview Dialog */}
          <QuotePreviewDialog
            open={showPreview}
            onClose={handleClosePreview}
            onGeneratePdf={generatePdf}
            quoteNumber={quoteNumber}
            quoteDate={quoteDate}
            expirationDate={expirationDate}
            startDate={startDate}
            duration={duration}
            selectedVehicle={selectedVehicle}
            selectedDestination={selectedDestination}
            basePrice={basePrice}
            withFuel={withFuel}
            estimatedFuelPrice={estimatedFuelPrice}
            selectedClientId={selectedClientId}
            clients={clients.map((c) => ({
              ...c,
              id: c.id.toString(),
            }))}
            vehicles={vehicles}
            regions={regions.map(region => ({
              id: region.id,
              name: region.nom_region,
              price: region.prix.prix
            }))}
            dialogContentRef={previewContentRef}
          />
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default QuoteForm;