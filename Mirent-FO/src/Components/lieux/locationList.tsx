import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  IconButton,
  DialogContentText,
  styled,
  InputAdornment,
  Toolbar,
} from '@mui/material';
import { Delete, Edit, Add, Search } from '@mui/icons-material';
import { Region, Prix } from '../../types/region';
import { RegionsService } from '../../services/regions.service';
import { toast, ToastContainer } from 'react-toastify';
import { addRegion, updateRegion } from '../../redux/features/lieux/locationSlice';

const LocationList = () => {
  const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }));

  const SecondaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[800],
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
  }));

  const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      backgroundColor: theme.palette.grey[100],
    },
  }));

  const dispatch = useDispatch<AppDispatch>();
  const addRegionStatus = useSelector((state: any) => state.locations.status); 
  const addRegionError = useSelector((state: any) => state.locations.error); 
  const [regions, setRegions] = useState<Region[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [formValues, setFormValues] = useState<Omit<Region, 'id' | 'prix'>>({
    nom_region: '',
    nom_district: null,
  });
  const [prixValue, setPrixValue] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRegions();
  }, [dispatch]);

  const fetchRegions = async () => {
    try {
      const data = await RegionsService.findAllWithDetails();
      const sortedRegions = data.sort((a, b) => a.nom_region.localeCompare(b.nom_region));
      setRegions([...sortedRegions]); 
      console.log('Regions after setRegions:', sortedRegions);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const handleOpenDialog = (region: Region | null = null) => {
    setSelectedRegion(region);
    setFormValues(
      region
        ? { nom_region: region.nom_region, nom_district: region.nom_district }
        : { nom_region: '', nom_district: null }
    );
    setPrixValue(region ? region.prix.prix : 0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRegion(null);
    setFormValues({ nom_region: '', nom_district: null });
    setPrixValue(0);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handlePrixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(event.target.value);
    if (!isNaN(parsedValue)) {
      setPrixValue(parsedValue);
    } else {
      setPrixValue(0);
      console.error('prix value invalide');
    }
  };

  const handleSave = async () => {
    try {
      if (selectedRegion) {
        // Modification 
        dispatch(
          updateRegion({
            id: selectedRegion.id,
            region: {
              ...formValues,
              prix: { id: selectedRegion.prix.id, prix: prixValue },
            },
          })
        );
        fetchRegions();
        toast.success('Région modifiée avec succès');
      } else {
        // Ajout
        const newRegion = {
          ...formValues,
          prix: { prix: prixValue },
        };
        console.log('add region data: ', newRegion);
        await dispatch(addRegion(newRegion as Region)).unwrap(); // Unwrap the promise
        toast.success('Région ajoutée avec succès');
      }
      fetchRegions();
      handleCloseDialog();
    } catch (err: any) {
      if (addRegionStatus === 'failed' && addRegionError) {
        toast.error(addRegionError); // Display error from Redux state
      } else {
        toast.error(err.message || 'Erreur lors de la sauvegarde de la région');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await RegionsService.removeRegion(id);
      fetchRegions();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting region:', error);
    }
  };

  const handleOpenDeleteDialog = (region: Region) => {
    setSelectedRegion(region);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedRegion(null);
  };

  const filteredRegions = regions.filter((region) =>
    region.nom_region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <ToastContainer />
      <Grid container spacing={3} sx={{ padding: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: "700", color: "#1976d2", marginBottom: 2 }}>
            Gestion des Lieux de location
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
            Ici, vous pouvez gérer les lieux de location, ajouter, modifier et supprimer.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              padding: 0,
              position: 'sticky', 
              top: '64px',
              backgroundColor: 'white', 
              zIndex: 2,
            }}
          >
            <SearchField
              label="Rechercher Région"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <PrimaryButton variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
              Ajouter une région
            </PrimaryButton>
          </Toolbar>
        </Grid>

        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{ maxHeight: '400px', overflow: 'auto' }}
          >
            <Table>
              <TableHead
                  sx={{
                    backgroundColor: '#1976d2',
                    position: 'sticky', 
                    top: 0, 
                    zIndex: 1, 
                  }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.9rem' }}>
                    Région
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.9rem' }}>
                    District
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.9rem' }}>
                    Prix(Ar)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.9rem' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRegions.map((region) => (
                  <TableRow key={region.id} hover>
                    <TableCell>{region.nom_region}</TableCell>
                    <TableCell>
                      {region.nom_district ? (
                        region.nom_district
                      ) : (
                        <Typography color="text.secondary">N/A</Typography>
                      )}
                    </TableCell>
                    <TableCell>{region.prix.prix}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog(region)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleOpenDeleteDialog(region)}>
                        <Delete color="secondary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedRegion ? 'Modifier la région' : 'Ajouter une région'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom Région"
              type="text"
              fullWidth
              name="nom_region"
              value={formValues.nom_region}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Nom District"
              type="text"
              fullWidth
              name="nom_district"
              value={formValues.nom_district || ''}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Prix"
              type="number"
              fullWidth
              name="prix"
              value={prixValue}
              onChange={handlePrixChange}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <SecondaryButton onClick={handleCloseDialog}>Annuler</SecondaryButton>
            <PrimaryButton onClick={handleSave}>Enregistrer</PrimaryButton>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer cette région ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <SecondaryButton onClick={handleCloseDeleteDialog}>Annuler</SecondaryButton>
            <PrimaryButton onClick={() => handleDelete(selectedRegion!.id)} color="secondary">
              Supprimer
            </PrimaryButton>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
};

export default LocationList;