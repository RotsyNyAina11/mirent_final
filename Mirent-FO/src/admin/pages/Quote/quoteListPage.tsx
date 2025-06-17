import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import InfoIcon from '@mui/icons-material/InfoOutlined';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../../redux/store';
import { fetchDevis } from '../../../redux/features/devis/devisSlice';
import { fetchClients } from '../../../redux/features/clients/customersSlice';
import { useAppDispatch } from '../../../hooks';
import { DatePicker } from '@mui/x-date-pickers';

const ITEMS_PER_PAGE = 6;

const DevisListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Local state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [devisToDelete, setDevisToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Redux state
  const { devis, loading, error } = useSelector((state: RootState) => state.devis);
  const clients = useSelector((state: RootState) => state.customer.clients);

  // Load data on mount
  useEffect(() => {
    dispatch(fetchDevis());
    dispatch(fetchClients());
  }, [dispatch]);

  // Map devis with client names
  const devisWithClientNames = devis.map((d) => {
    const client = clients.find((c) => c.id === d.clientId);
    return {
      ...d,
      clientName: client ? client.lastName : 'Inconnu',
    };
  });

  // Filtered devis
  const filteredDevis = devisWithClientNames.filter((d) => {
    const matchesSearch = d.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = selectedClientId ? d.clientId === Number(selectedClientId) : true;
    const matchesDate = startDateFilter
      ? new Date(d.startDate) >= new Date(startDateFilter)
      : true;
    return matchesSearch && matchesClient && matchesDate;
  });

  const totalPages = Math.ceil(filteredDevis.length / ITEMS_PER_PAGE);
  const paginatedDevis = filteredDevis.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleDeleteClick = (id: string) => {
    setDevisToDelete(id);
    setOpenConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (devisToDelete) {
      console.log(`Deleting devis with ID: ${devisToDelete}`);
      setSnackbar({
        open: true,
        message: 'Devis supprimé avec succès.',
        severity: 'success',
      });
    }
    setOpenConfirmDialog(false);
    setDevisToDelete(null);
  };

  const cancelDelete = () => {
    setOpenConfirmDialog(false);
    setDevisToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR');

  const getStatusChipColor = (status: string) => {
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            Liste des Devis
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/quote')}
          >
            Nouveau Devis
          </Button>
        </Box>

        {/* Toggle View Mode */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant={viewMode === 'cards' ? 'contained' : 'outlined'}
            startIcon={<ViewModuleIcon />}
            onClick={() => setViewMode('cards')}
          >
            Vue Carte
          </Button>
          <Button
            sx={{ ml: 1 }}
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            startIcon={<ViewListIcon />}
            onClick={() => setViewMode('table')}
          >
            Vue Tableau
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Rechercher par client"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrer par Client</InputLabel>
              <Select
                value={selectedClientId}
                label="Filtrer par Client"
                onChange={(e) => setSelectedClientId(e.target.value as string)}
              >
                <MenuItem value="">
                  <em>Tous les clients</em>
                </MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Date de début"
              value={startDateFilter}
              onChange={(newValue) =>
                setStartDateFilter(
                  newValue
                    ? typeof newValue === 'object' && 'toDate' in newValue
                      ? (newValue as any).toDate()
                      : (newValue as Date)
                    : null
                )
              }
              slotProps={{
                textField: {
                  variant: 'outlined',
                  fullWidth: true,
                  size: 'small',
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Loading / Error */}
        {loading && <Typography align="center">Chargement...</Typography>}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Cards View */}
        {viewMode === 'cards' && (
          <Grid container spacing={3}>
            {paginatedDevis.length > 0 ? (
              paginatedDevis.map((d) => (
                <Grid item xs={12} sm={6} md={4} key={d.id}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 2,
                      p: 2,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                          Devis #{d.id}
                        </Typography>
                        <Chip
                          label={d.status}
                          color={getStatusChipColor(d.status)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Client : {d.clientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Du {formatDate(d.startDate)} au {formatDate(d.endDate)}
                      </Typography>
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        Montant total : {d.totalAmount.toLocaleString()} Ar
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}
                    >
                      <Tooltip title="Détails">
                        <Button
                          size="small"
                          color="info"
                          startIcon={<InfoIcon fontSize="small" />}
                          onClick={() => navigate(`/admin/devis/${d.id}`)}
                        >
                          Détails
                        </Button>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/quote?edit=${d.id}`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(d.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Imprimer">
                        <IconButton size="small" color="secondary">
                          <PrintIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography align="center" color="textSecondary" sx={{ py: 4 }}>
                  Aucun devis trouvé.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Date de location</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDevis.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>#{d.id}</TableCell>
                    <TableCell>{d.clientName}</TableCell>
                    <TableCell>
                      {formatDate(d.startDate)} → {formatDate(d.endDate)}
                    </TableCell>
                    <TableCell>{d.totalAmount.toLocaleString()} Ar</TableCell>
                    <TableCell>
                      <Chip
                        label={d.status}
                        color={getStatusChipColor(d.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Détails">
                        <IconButton
                          size="small"
                          onClick={() => {
                            navigate(`/admin/devis/${d.id}`);
                          }}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/quote?edit=${d.id}`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(d.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={cancelDelete}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer ce devis ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

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

export default DevisListPage;