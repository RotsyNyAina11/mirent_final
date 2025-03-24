import React, { useState, useEffect } from 'react';
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
  Checkbox,
  Box, // Importez Box de @mui/material
} from '@mui/material';
import { Delete, Edit, Add, Search } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { Region, Prix } from '../../types/region';
import { RegionsService } from '../../services/regions.service';
import { addRegion, updateRegion } from '../../redux/features/lieux/locationSlice';

const LocationList = () => {
  const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#1976d2',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  }));

  const SecondaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#d32f2f',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#c62828',
    },
  }));

  const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      backgroundColor: theme.palette.grey[100],
    },
  }));

  const dispatch = useDispatch<AppDispatch>();
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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const data = await RegionsService.findAllWithDetails();
      const sortedRegions = data.sort((a, b) => a.nom_region.localeCompare(b.nom_region));
      setRegions(sortedRegions);
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
    }
  };

  const handleSave = async () => {
    try {
      if (selectedRegion) {
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
        const newRegion = {
          ...formValues,
          prix: { prix: prixValue },
        };
        await dispatch(addRegion(newRegion as Region)).unwrap();
        toast.success('Région ajoutée avec succès');
      }
      fetchRegions();
      handleCloseDialog();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la sauvegarde de la région');
    }
  };

  const handleDelete = async () => {
    try {
      for (const id of selectedItems) {
        await RegionsService.removeRegion(id);
      }
      fetchRegions();
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting regions:', error);
    }
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === regions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(regions.map((region) => region.id));
    }
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
          <TableContainer component={Paper} elevation={3} sx={{ maxHeight: '400px', overflow: 'auto' }}>
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
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                    Actions
                    <Box
                    sx={{
                      marginLeft: '8px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {selectedItems.length > 0 && (
                      <SecondaryButton
                        variant="contained"
                        size="small"
                        onClick={handleDelete}
                        sx={{
                          marginRight: '8px', // Marge à droite pour séparer du checkbox
                        }}
                      >
                        Supprimer tout ({selectedItems.length})
                      </SecondaryButton>
                    )}
                    <Checkbox
                      checked={selectedItems.length === regions.length}
                      indeterminate={
                        selectedItems.length > 0 && selectedItems.length < regions.length
                      }
                      onChange={handleSelectAll}
                      sx={{
                        padding: 0,
                        color: 'white',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                    />
                  </Box>
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
                    <Checkbox
                      checked={selectedItems.includes(region.id)}
                      onChange={() => handleSelectItem(region.id)}
                      sx={{
                        padding: 0,
                        marginRight: '8px',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(region)}
                      disabled={!selectedItems.includes(region.id)}
                      sx={{
                        color: selectedItems.includes(region.id) ? '#1976d2' : '#bdbdbd',
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setOpenDeleteDialog(true)}
                      disabled={!selectedItems.includes(region.id)}
                      sx={{
                        color: selectedItems.includes(region.id) ? '#d32f2f' : '#bdbdbd',
                      }}
                    >
                      <Delete />
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
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette région ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
          <Button onClick={handleDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  </>
);
};

export default LocationList;