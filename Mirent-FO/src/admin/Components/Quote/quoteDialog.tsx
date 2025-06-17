import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createTheme } from '@mui/material/styles';

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
}

interface Region {
  id: number;
  name: string;
  price: number;
}

// Props for the QuotePreviewDialog component
interface QuotePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  onGeneratePdf: () => void;
  quoteNumber: string;
  quoteDate: Date | null;
  expirationDate: Date | null;
  startDate: Date | null;
  duration: number;
  selectedVehicle: string;
  selectedDestination: string;
  basePrice: number;
  withFuel: boolean;
  estimatedFuelPrice: number;
  selectedClientId: string;
  clients: Client[];
  vehicles: Vehicle[];
  regions: Region[];
  dialogContentRef: React.RefObject<HTMLDivElement | null>;
}

// Custom Material-UI theme (subset for preview)
const theme = createTheme({
  palette: {
    primary: { main: '#2a52be' },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    body2: { fontSize: '0.85rem', color: '#333' },
    subtitle1: { fontSize: '1rem', color: '#333' },
    caption: { fontSize: '0.75rem', color: '#555' },
  },
});

const QuotePreviewDialog: React.FC<QuotePreviewDialogProps> = ({
  open,
  onClose,
  onGeneratePdf,
  quoteNumber,
  quoteDate,
  expirationDate,
  startDate,
  duration,
  selectedVehicle,
  selectedDestination,
  basePrice,
  withFuel,
  estimatedFuelPrice,
  selectedClientId,
  clients,
  vehicles,
  regions,
  dialogContentRef,
}) => {
  // Helper functions
  const getVehicleName = (id: string) =>
    vehicles.find((v) => v.id === Number(id))?.nom || 'N/A';
  const getDestinationName = (id: string) =>
    regions.find((r) => r.id === Number(id))?.name || 'N/A';
  const getClient = (id: string) => {
    console.log('getClient called with id:', id, 'type:', typeof id);
    console.log('Available clients:', clients);
    const foundClient = clients.find((c) =>  Number(c.id) === Number(id));
    console.log('Found client:', foundClient);
    return (
      foundClient || { id: '', lastName: 'N/A', email: 'N/A', phone: 'N/A', address: 'N/A' }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent
        ref={dialogContentRef}
        sx={{ p: 0, backgroundColor: '#fff', position: 'relative' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            p: 3,
            pb: 1,
            borderBottom: '1px solid #eee',
            backgroundColor: '#fff',
          }}
        >
          <Box>
            <img
              src="/src/assets/horizontal.png"
              alt="Mirent Logo"
              style={{ maxWidth: '300px', objectFit: 'contain' }}
            />
          </Box>
          <Box
            sx={{
              border: '1px solid blue',
              borderRadius: '10px',
              minWidth: '300px',
              minHeight: '150px',
              backgroundColor: '#f0f0f0',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ textDecoration: 'underline', fontWeight: 'bold', color: 'blue' }}
            >
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
          <Typography
            variant="h6"
            sx={{ color: theme.palette.primary.main, fontSize: '1.5rem' }}
          >
            {quoteNumber}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#333' }}>
            <Typography component="span" fontWeight="bold">
              Date du devis:
            </Typography>{' '}
            {quoteDate
              ? format(quoteDate, 'dd MMMM yyyy', { locale: fr })
              : 'Non spécifiée'}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#333' }}>
            <Typography component="span" fontWeight="bold">
              Date d'expiration:
            </Typography>{' '}
            {expirationDate
              ? format(expirationDate, 'dd MMMM yyyy', { locale: fr })
              : 'Non spécifiée'}
          </Typography>
        </Box>
        <Box sx={{ p: 3, pt: 1 }}>
          <Grid
            container
            sx={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', mb: 2 }}
          >
            <Grid
              item
              xs={2}
              sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}
            >
              <Typography variant="body2" fontWeight="bold">
                Véhicule
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}
            >
              <Typography variant="body2" fontWeight="bold">
                Destination
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}
            >
              <Typography variant="body2" fontWeight="bold">
                Date début
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}
            >
              <Typography variant="body2" fontWeight="bold">
                Durée
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ backgroundColor: '#f0f0f0', p: 1, borderRight: '1px solid #ddd' }}
            >
              <Typography variant="body2" fontWeight="bold">
                Carburant
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ backgroundColor: '#f0f0f0', p: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Prix
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}
            >
              <Typography variant="body2">{getVehicleName(selectedVehicle)}</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}
            >
              <Typography variant="body2">{getDestinationName(selectedDestination)}</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}
            >
              <Typography variant="body2">
                {startDate ? format(startDate, 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}
            >
              <Typography variant="body2">{duration}</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ p: 1, borderRight: '1px solid #eee', borderTop: '1px solid #ddd' }}
            >
              <Typography variant="body2">{withFuel ? 'Oui' : 'Non'}</Typography>
            </Grid>
            <Grid item xs={2} sx={{ p: 1, borderTop: '1px solid #ddd' }}>
              <Typography variant="body2" align="right">
                {basePrice.toFixed(2)} Ar
              </Typography>
            </Grid>
            {withFuel && (
              <>
                <Grid
                  item
                  xs={10}
                  sx={{
                    p: 1,
                    borderRight: '1px solid #eee',
                    borderTop: '1px solid #ddd',
                    textAlign: 'right',
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Prix estimatif du carburant:
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ p: 1, borderTop: '1px solid #ddd' }}>
                  <Typography variant="body2" align="right">
                    {estimatedFuelPrice.toFixed(2)} Ar
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
        <Box
        sx={{
            ml: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            p: 3, 
            pt: 0, 
        }}
        >
        <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>
            Antananarivo, le {format(new Date(), 'dd MMMM yyyy', { locale: fr })}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: '#555', mt: 1 }}>
            Pour Mirent,
        </Typography>
        <img
            src="/src/assets/signature.png"
            alt="Mirent Signature"
            style={{ maxWidth: '200px', objectFit: 'contain' }} 
        />
        </Box>
        <Box
          sx={{
            p: 3,
            pt: 2,
            borderTop: '1px solid #eee',
            backgroundColor: '#f8f8f8',
            textAlign: 'center',
            mt: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>
            mirent.mdg@gmail.com
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>
            Tel: +261381369004
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: '#555', mt: 1 }}>
            Not II P 136 Ter Avaradoha Antananarivo 101
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>
            NIF: 7018487985 Stat: 4929511024010341
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>
            RIB: 00015000080386310000137
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, justifyContent: 'center' }}
      >
        <Button onClick={onClose} color="primary" variant="outlined">
          Fermer
        </Button>
        <Button onClick={onGeneratePdf} color="success" variant="contained">
          Créer et Imprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuotePreviewDialog;