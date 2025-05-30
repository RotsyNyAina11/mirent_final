import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Box, Typography, Paper, Grid, MenuItem, Select, InputLabel, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Dialog, DialogContent, DialogActions, Snackbar, Alert, DialogTitle } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { differenceInDays, format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { addClient, fetchClients } from '../../../redux/features/clients/customersSlice';
import { useAppDispatch } from '../../../hooks';

// Extend the Window interface to include html2canvas and jspdf
declare global {
  interface Window {
    html2canvas?: any;
    jspdf?: any;
  }
}

// Interface for Vehicle and Destination remain unchanged
interface Vehicle {
  id: string;
  name: string;
}

interface Destination {
  id: string;
  name: string;
  price: number;
}

// Interface for Client (aligned with Customer type from clientSlice)
interface Client {
  id: string;
  name: string; 
  email: string;
  phone: string;
}

// Static data for vehicles and destinations remain unchanged
const vehicles: Vehicle[] = [
  { id: '1', name: 'Berline (Toyota Camry)' },
  { id: '2', name: 'SUV (Honda CR-V)' },
  { id: '3', name: 'Fourgonnette (Mercedes-Benz Sprinter)' },
];

const destinations: Destination[] = [
  { id: 'a', name: 'Tour de ville', price: 20 },
  { id: 'b', name: 'Évasion en montagne', price: 50 },
  { id: 'c', name: 'Conduite côtière', price: 30 },
];

// Custom Material-UI theme remains unchanged
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
    h4: { fontWeight: 700, fontSize: '2.1rem' },
    h5: { fontWeight: 600, fontSize: '1.6rem' },
    h6: { fontWeight: 500, fontSize: '1.25rem' },
    subtitle1: { fontSize: '1rem', color: '#333' },
    body1: { fontSize: '0.95rem', color: '#333' },
    caption: { fontSize: '0.75rem', color: '#555' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: '8px', textTransform: 'none' } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: '8px', boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.12)' } } },
  },
});

const QuoteForm: React.FC = () => {
  // Redux hooks
  const dispatch = useAppDispatch();
  const { clients, loading, error } = useSelector((state: RootState) => state.customer);

  // State variables (remove clients state as it's now managed by Redux)
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [openClientDialog, setOpenClientDialog] = useState<boolean>(false);
  const [newClient, setNewClient] = useState<Client>({
    id: '',
    name: '',
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
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const previewContentRef = useRef<HTMLDivElement>(null);

  // Fetch clients on component mount
  useEffect(() => {
    dispatch(fetchClients());
    setQuoteNumber(`DEV-${Date.now().toString().slice(-6)}`);
  }, [dispatch]);

  // Effect to calculate duration (unchanged)
  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate);
      setDuration(days > 0 ? days : 0);
    } else {
      setDuration(0);
    }
  }, [startDate, endDate]);

  // Effect to calculate base price (unchanged)
  useEffect(() => {
    let calculatedBasePrice = 0;
    const destination = destinations.find((d) => d.id === selectedDestination);
    if (destination) {
      calculatedBasePrice += destination.price * duration;
    }
    setBasePrice(calculatedBasePrice);
  }, [duration, selectedDestination]);

  // Effect to calculate final total price (unchanged)
  useEffect(() => {
    let total = basePrice;
    if (withFuel) {
      total += estimatedFuelPrice;
    }
    setFinalTotalPrice(total);
  }, [basePrice, withFuel, estimatedFuelPrice]);

  // Effect to load external scripts (unchanged)
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

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas-script', () => {
      html2canvasLoaded = true;
      checkAllLoaded();
    });
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf-script', () => {
      jspdfLoaded = true;
      checkAllLoaded();
    });
  }, []);

  // Handler for saving a new client
  const handleSaveClient = async () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      setSnackbarMessage('Veuillez remplir tous les champs du client.');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    try {
      const resultAction = await dispatch(addClient({
        lastName: newClient.name, 
        email: newClient.email,
        phone: newClient.phone,
        logo: '', 
      }));

      if (addClient.fulfilled.match(resultAction)) {
        setSelectedClientId(resultAction.payload.id.toString());
        setOpenClientDialog(false);
        setNewClient({ id: '', name: '', email: '', phone: ''});
        setSnackbarMessage('Client ajouté avec succès !');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(resultAction.payload as string || 'Erreur lors de l\'enregistrement du client.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Erreur lors de l\'enregistrement du client.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Handlers (unchanged except for client-related logic)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const selectedClient = clients.find((c) => c.id === Number(selectedClientId));
    console.log({
      quoteNumber,
      client: selectedClient || { id: '', name: 'N/A', email: 'N/A', phone: 'N/A', address: 'N/A' },
      quoteDate: quoteDate ? format(quoteDate, 'dd/MM/yyyy', { locale: fr }) : '',
      expirationDate: expirationDate ? format(expirationDate, 'dd/MM/yyyy', { locale: fr }) : '',
      startDate: startDate ? format(startDate, 'dd/MM/yyyy', { locale: fr }) : '',
      endDate: endDate ? format(endDate, 'dd/MM/yyyy', { locale: fr }) : '',
      duration,
      selectedVehicle: vehicles.find((v) => v.id === selectedVehicle)?.name,
      selectedDestination: destinations.find((d) => d.id === selectedDestination)?.name,
      basePrice,
      withFuel,
      estimatedFuelPrice: withFuel ? estimatedFuelPrice : 0,
      finalTotalPrice,
    });
    setSnackbarMessage('Devis généré avec succès !');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const handleCreateAndPrint = async () => {
    if (!selectedClientId || !startDate || !endDate || !selectedVehicle || !selectedDestination || !expirationDate) {
      setSnackbarMessage("Veuillez remplir tous les champs obligatoires, y compris la sélection du client et la date d'expiration, avant de créer et d'imprimer le devis.");
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
    console.log('Fonctionnalité Confirmer en cours de développement.');
    setSnackbarMessage('Fonctionnalité Confirmer en cours de développement.');
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };

  const handlePreview = () => {
    if (!selectedClientId || !startDate || !endDate || !selectedVehicle || !selectedDestination || !expirationDate) {
      setSnackbarMessage("Veuillez remplir tous les champs obligatoires, y compris la sélection du client et la date d'expiration, avant de prévisualiser le devis.");
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
    setNewClient({ id: '', name: '', email: '', phone: '' });
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
    setQuoteNumber(`DEV-${Date.now().toString().slice(-6)}`);
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
        dialogContent.style[prop as any] = originalStyles[prop as keyof typeof originalStyles];
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
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
      const clientNameForFile = selectedClient ? selectedClient.lastName.replace(/\s/g, '_') : 'client';
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
        dialogContent.style[prop as any] = originalStyles[prop as keyof typeof originalStyles];
      }
    }
  };

  const getVehicleName = (id: string) => vehicles.find((v) => v.id === id)?.name || 'N/A';
  const getDestinationName = (id: string) => destinations.find((d) => d.id === id)?.name || 'N/A';
  const getDestinationUnitPrice = (id: string) => destinations.find((d) => d.id === id)?.price || 0;

  const getClient = (id: string) => {
  console.log(`getClient: Searching for ID='${id}' (type: ${typeof id})`);
  const foundClient = clients.find(c => {
    return c.id === Number(id);
  });

  if (foundClient) {
    return foundClient;
  } else {
    console.log('getClient: Client not found, returning default.');
    // Objet par défaut (assurez-vous qu'il correspond à la structure attendue, notamment lastName)
    return { id: '', lastName: 'N/A', email: 'N/A', phone: 'N/A', address: 'N/A' }; 
    // Si votre type Customer a plus de champs obligatoires, ajoutez-les ici avec des valeurs par défaut
  }
};

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
          {loading && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.info.main }}>
              Chargement des clients...
            </Typography>
          )}
          {error && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.error.main }}>
              Erreur: {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Button variant="outlined" color="info" onClick={handlePreview}>Aperçu</Button>
            <Button variant="contained" color="success" onClick={handleConfirm}>Confirmer</Button>
            <Button variant="contained" color="primary" onClick={handlePrint}>Imprimer</Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>Annuler</Button>
          </Box>

          <Paper elevation={6} sx={{ p: 5, maxWidth: 900, margin: 'auto', borderRadius: '12px' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  N° Devis: <strong style={{ color: theme.palette.primary.main }}>{quoteNumber}</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h4" gutterBottom align="right" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                  Devis de location de véhicule
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4, color: theme.palette.primary.dark }}>
              Détails du Devis
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required variant="outlined" disabled={loading}>
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
                    onChange={(newValue) => setQuoteDate(newValue ? new Date(newValue as any) : null)}
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
                    onChange={(newValue) => setExpirationDate(newValue ? new Date(newValue as any) : null)}
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
                    onChange={(newValue) => setStartDate(newValue ? new Date(newValue as any) : null)}
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
                    onChange={(newValue) => setEndDate(newValue ? new Date(newValue as any) : null)}
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
                      {vehicles.map((vehicle) => (
                        <MenuItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel id="destination-select-label">Sélectionnez une destination</InputLabel>
                    <Select
                      labelId="destination-select-label"
                      value={selectedDestination}
                      label="Sélectionnez une destination"
                      onChange={(e) => setSelectedDestination(e.target.value as string)}
                    >
                      {destinations.map((destination) => (
                        <MenuItem key={destination.id} value={destination.id}>
                          {destination.name} ({destination.price} Ar)
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
                      <FormControlLabel value="yes" control={<Radio />} label="Avec Carburant" />
                      <FormControlLabel value="no" control={<Radio />} label="Sans Carburant" />
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
                  <Typography variant="h6" align="right" sx={{ mt: 1, mb: 1, color: 'text.secondary' }}>
                    Prix de base: {basePrice.toFixed(2)} Ar
                  </Typography>
                  {withFuel && (
                    <Typography variant="h6" align="right" sx={{ mb: 1, color: 'text.secondary' }}>
                      Carburant estimatif: {estimatedFuelPrice.toFixed(2)} Ar
                    </Typography>
                  )}
                  <Typography variant="h5" align="right" sx={{ mt: 3, mb: 2, fontWeight: 'bold', color: theme.palette.secondary.main }}>
                    Prix total final: <span style={{ fontSize: '1.8rem', color: theme.palette.success.main }}>{finalTotalPrice.toFixed(2)} Ar</span>
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
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Numéro de téléphone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
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

          {/* Preview Dialog */}
          <Dialog open={showPreview} onClose={handleClosePreview} maxWidth="md" fullWidth>
            <DialogContent ref={previewContentRef} sx={{ p: 0, backgroundColor: '#fff', position: 'relative' }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                p: 3,
                pb: 1,
                borderBottom: '1px solid #eee',
                backgroundColor: '#fff',
              }}>
                <Box>
                  <img src="/src/assets/horizontal.png" alt="Mirent Logo" style={{ maxWidth: '300px', objectFit: 'contain' }} />
                </Box>
                <Box sx={{
                  border: '1px solid blue',
                  borderRadius: '10px',
                  minWidth: '300px',
                  minHeight: '150px',
                  backgroundColor: '#f0f0f0',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}>
                  <Typography variant="subtitle1" sx={{ textDecoration: 'underline', fontWeight: 'bold', color: 'blue' }}>
                    Client:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#333' }}>
                    Nom: {getClient(selectedClientId).lastName}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#333' }}>
                    Email: {getClient(selectedClientId).email}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#333' }}>
                    Téléphone: {getClient(selectedClientId).phone}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 3, pt: 2, pb: 1 }}>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {quoteNumber}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#333' }}>
                  <Typography component="span" fontWeight="bold">Date du devis:</Typography> {quoteDate ? format(quoteDate, 'dd MMMM yyyy', { locale: fr }) : 'Non spécifiée'}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#333' }}>
                  <Typography component="span" fontWeight="bold">Date d'expiration:</Typography> {expirationDate ? format(expirationDate, 'dd MMMM yyyy', { locale: fr }) : 'Non spécifiée'}
                </Typography>
              </Box>

              <Box sx={{ p: 3, pt: 1 }}>
                <Grid container sx={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  mb: 2,
                }}>
                  <Grid item xs={1} sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}>
                    <Typography variant="body2" fontWeight="bold">Réf.</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}>
                    <Typography variant="body2" fontWeight="bold">Voiture</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}>
                    <Typography variant="body2" fontWeight="bold">Destination</Typography>
                  </Grid>
                  <Grid item xs={1} sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}>
                    <Typography variant="body2" fontWeight="bold">Prix Unitaire</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}>
                    <Typography variant="body2" fontWeight="bold">Date</Typography>
                  </Grid>
                  <Grid item xs={1} sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}>
                    <Typography variant="body2" fontWeight="bold">Jour</Typography>
                  </Grid>
                  <Grid item xs={1} sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}>
                    <Typography variant="body2" fontWeight="bold">Carburant</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ backgroundColor: '#f0f0f0', p: 1 }}>
                    <Typography variant="body2" fontWeight="bold" align="right">Prix total</Typography>
                  </Grid>

                  <Grid item xs={1} sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}>
                    <Typography variant="body2">1</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}>
                    <Typography variant="body2">{getVehicleName(selectedVehicle)}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}>
                    <Typography variant="body2">{getDestinationName(selectedDestination)}</Typography>
                  </Grid>
                  <Grid item xs={1} sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}>
                    <Typography variant="body2">{getDestinationUnitPrice(selectedDestination).toFixed(2)} Ar</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}>
                    <Typography variant="body2">
                      {startDate ? format(startDate, 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}>
                    <Typography variant="body2">{duration}</Typography>
                  </Grid>
                  <Grid item xs={1} sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}>
                    <Typography variant="body2">{withFuel ? 'Oui' : 'Non'}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ p: 1, borderTop: '1px solid #ddd' }}>
                    <Typography variant="body2" align="right">{basePrice.toFixed(2)} Ar</Typography>
                  </Grid>

                  {withFuel && (
                    <>
                      <Grid item xs={10} sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd', textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight="bold">Prix estimatif du carburant:</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{ p: 1, borderTop: '1px solid #ddd' }}>
                        <Typography variant="body2" align="right">{estimatedFuelPrice.toFixed(2)} Ar</Typography>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={10} sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd', backgroundColor: '#f9f9f9', textAlign: 'right' }}>
                    <Typography variant="body1" fontWeight="bold">TOTAL</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ p: 1, borderTop: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
                    <Typography variant="body1" fontWeight="bold" align="right">{finalTotalPrice.toFixed(2)} Ar</Typography>
                  </Grid>
                </Grid>

                <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic', color: '#555' }}>
                  Arrêtée la présente facture proforma à la somme de: "QUATRES CENT MILLE ARIARY ".
                </Typography>
              </Box>

              <Box sx={{
                p: 3,
                pt: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                pl: 3,
                flexWrap: 'wrap',
              }}>
                <Box sx={{ ml: 'auto' }}>
                  <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>
                    Antananarivo, le {format(new Date(), 'dd MMMM yyyy', { locale: fr })}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#555', mt: 1 }}>
                    Pour Mirent,
                  </Typography>
                  <img src="/src/assets/signature.png" alt="Mirent Signature" style={{ minWidth: '200px', objectFit: 'contain' }} />
                </Box>
              </Box>

              <Box sx={{
                p: 3,
                pt: 2,
                borderTop: '1px solid #eee',
                backgroundColor: '#f8f8f8',
                textAlign: 'center',
                mt: 2,
                flexWrap: 'wrap',
              }}>
                <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>Mail: mirent.mdg@gmail.com</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>Tel: +261 38 13 690 04</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#555', mt: 1 }}>Lot II P 136 Ter Avaradoha Antananarivo 101</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>NIF: 7018487985 Stat: 49295 11 024 0 10341</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>RIB: 00015 00008 0386310000 1 37</Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, justifyContent: 'center' }}>
              <Button onClick={handleClosePreview} color="primary" variant="outlined">
                Fermer
              </Button>
              <Button onClick={generatePdf} color="success" variant="contained">
                Créer et Imprimer
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default QuoteForm;