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
  Box,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
  TablePagination,
  Slider,
  Collapse,
  TableSortLabel,
  Fade,
  Tooltip,
} from '@mui/material';
import { Delete, Edit, Add, Search, FilterList, FileDownload, LocationOn, Map, AttachMoney } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { Region, Prix } from '../../types/region';
import { RegionsService } from '../../services/regions.service';
import { addRegion, updateRegion } from '../../redux/features/lieux/locationSlice';
import Papa from 'papaparse';

// Styles personnalisés
const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3b82f6',
  color: theme.palette.common.white,
  padding: '8px 16px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#2563eb',
    transform: 'scale(1.02)',
    transition: 'all 0.3s ease',
  },
  '&.Mui-disabled': {
    backgroundColor: '#d1d5db',
    color: '#6b7280',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ef4444',
  color: theme.palette.common.white,
  padding: '8px 16px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#dc2626',
    transform: 'scale(1.02)',
    transition: 'all 0.3s ease',
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: '#6b7280',
  borderColor: '#d1d5db',
  padding: '8px 16px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    borderColor: '#9ca3af',
    backgroundColor: '#f3f4f6',
    transform: 'scale(1.02)',
    transition: 'all 0.3s ease',
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    '& fieldset': {
      borderColor: '#d1d5db',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.9rem',
    color: '#1f2937',
  },
}));

const FilterField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#d1d5db',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.9rem',
    color: '#1f2937',
  },
}));

const FormField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    '& fieldset': {
      borderColor: '#d1d5db',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3b82f6',
  },
  '& .MuiInputBase-input': {
    fontSize: '0.9rem',
    color: '#1f2937',
  },
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: '#ef4444',
  fontSize: '0.8rem',
  marginTop: '4px',
  marginLeft: '14px',
}));

const LocationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Jusqu'à 600px

  const [regions, setRegions] = useState<Region[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regionToDelete, setRegionToDelete] = useState<Region | null>(null);
  const [formValues, setFormValues] = useState<Omit<Region, 'id' | 'prix'>>({
    nom_region: '',
    nom_district: null,
  });
  const [prixValue, setPrixValue] = useState<number>(0);
  const [errors, setErrors] = useState<{ nom_region?: string; prix?: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterOpen, setFilterOpen] = useState(false);
  const [districtFilter, setDistrictFilter] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Region>('nom_region');

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const data = await RegionsService.findAllWithDetails();
      const sortedRegions = data.sort((a, b) => a.nom_region.localeCompare(b.nom_region));
      setRegions(sortedRegions);
      const max = Math.max(...sortedRegions.map((r) => r.prix.prix), 1000000);
      setMaxPrice(max);
      setPriceRange([0, max]);
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
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRegion(null);
    setFormValues({ nom_region: '', nom_district: null });
    setPrixValue(0);
    setErrors({});
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    validateField(name, value);
  };

  const handlePrixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(event.target.value);
    if (!isNaN(parsedValue)) {
      setPrixValue(parsedValue);
      validateField('prix', parsedValue);
    } else {
      setPrixValue(0);
      validateField('prix', 0);
    }
  };

  const validateField = (name: string, value: string | number) => {
    const newErrors = { ...errors };
    if (name === 'nom_region') {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors.nom_region = 'Le nom de la région est requis';
      } else {
        delete newErrors.nom_region;
      }
    } else if (name === 'prix') {
      if (typeof value === 'number' && value < 0) {
        newErrors.prix = 'Le prix doit être supérieur ou égal à 0';
      } else {
        delete newErrors.prix;
      }
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: { nom_region?: string; prix?: string } = {};
    if (!formValues.nom_region || formValues.nom_region.trim() === '') {
      newErrors.nom_region = 'Le nom de la région est requis';
    }
    if (prixValue < 0) {
      newErrors.prix = 'Le prix doit être supérieur ou égal à 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetRegionName = () => {
    setFormValues({ ...formValues, nom_region: '' });
    validateField('nom_region', '');
  };

  const resetDistrictName = () => {
    setFormValues({ ...formValues, nom_district: null });
  };

  const resetPrice = () => {
    setPrixValue(0);
    validateField('prix', 0);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
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
      if (selectedItems.length > 0) {
        for (const id of selectedItems) {
          await RegionsService.removeRegion(id);
        }
        toast.success(`${selectedItems.length} région(s) supprimée(s) avec succès`);
      } else if (regionToDelete) {
        await RegionsService.removeRegion(regionToDelete.id);
        toast.success('Région supprimée avec succès');
      }
      fetchRegions();
      setSelectedItems([]);
      setRegionToDelete(null);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting regions:', error);
      toast.error('Erreur lors de la suppression');
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Tri des colonnes
  const handleRequestSort = (property: keyof Region) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filtres
  const filteredRegions = regions.filter((region) => {
    const matchesSearch = region.nom_region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = districtFilter
      ? region.nom_district?.toLowerCase().includes(districtFilter.toLowerCase())
      : true;
    const matchesPrice =
      region.prix.prix >= priceRange[0] && region.prix.prix <= priceRange[1];
    return matchesSearch && matchesDistrict && matchesPrice;
  });

  const sortedRegions = React.useMemo(() => {
    return [...filteredRegions].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      if (orderBy === 'prix') {
        aValue = a.prix.prix;
        bValue = b.prix.prix;
      } else if (orderBy === 'nom_district') {
        aValue = a.nom_district || '';
        bValue = b.nom_district || '';
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  }, [filteredRegions, order, orderBy]);

  const paginatedRegions = sortedRegions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Export CSV
  const exportToCSV = () => {
    const csvData = sortedRegions.map((region) => ({
      Région: region.nom_region,
      District: region.nom_district || 'N/A',
      'Prix (Ar)': region.prix.prix,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'regions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={3} sx={{ padding: isMobile ? 2 : 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        {/* Titre et description */}
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1f2937', marginBottom: 1 }}>
            Gestion des Lieux de Location
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Gérer les lieux de location : ajouter, modifier ou supprimer des régions.
          </Typography>
        </Grid>

        {/* Barre d'outils */}
        <Grid item xs={12}>
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 2 : 0,
              padding: 0,
              position: 'sticky',
              top: '64px',
              backgroundColor: '#f9fafb',
              zIndex: 2,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
              <SearchField
                placeholder="Rechercher une région..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#6b7280' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: isMobile ? '100%' : '300px' }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterOpen(!filterOpen)}
                sx={{
                  borderColor: '#d1d5db',
                  color: '#1f2937',
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f3f4f6',
                  },
                }}
              >
                Filtres
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {selectedItems.length > 0 && (
                <SecondaryButton
                  variant="contained"
                  size="small"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Supprimer ({selectedItems.length})
                </SecondaryButton>
              )}
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={exportToCSV}
                sx={{
                  borderColor: '#d1d5db',
                  color: '#1f2937',
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f3f4f6',
                  },
                }}
              >
                Exporter CSV
              </Button>
              <PrimaryButton variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
                Ajouter une région
              </PrimaryButton>
            </Box>
          </Toolbar>
        </Grid>

        {/* Section des filtres */}
        <Grid item xs={12}>
          <Collapse in={filterOpen}>
            <Box
              sx={{
                p: 2,
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                mb: 2,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 2, color: '#1f2937' }}>
                Filtres
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FilterField
                    label="Nom du district"
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                    Plage de prix (Ar): {priceRange[0]} - {priceRange[1]}
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    min={0}
                    max={maxPrice}
                    step={1000}
                    sx={{ color: '#3b82f6' }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Grid>

        {/* Tableau ou cartes (selon la taille de l'écran) */}
        <Grid item xs={12}>
          {isMobile ? (
            // Affichage sous forme de cartes sur mobile
            <Box>
              {paginatedRegions.length > 0 ? (
                paginatedRegions.map((region) => (
                  <Card
                    key={region.id}
                    sx={{
                      mb: 2,
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#fff',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'box-shadow 0.3s ease',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Checkbox
                          checked={selectedItems.includes(region.id)}
                          onChange={() => handleSelectItem(region.id)}
                          sx={{ padding: 0, mr: 1 }}
                        />
                        <Typography variant="body1" fontWeight={500}>
                          {region.nom_region}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        District: {region.nom_district || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Prix: {region.prix.prix} Ar
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                      <IconButton
                        onClick={() => handleOpenDialog(region)}
                        sx={{
                          color: '#3b82f6',
                          '&:hover': { backgroundColor: '#dbeafe', transition: 'background-color 0.3s ease' },
                        }}
                        aria-label="Modifier la région"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setRegionToDelete(region);
                          setOpenDeleteDialog(true);
                        }}
                        sx={{
                          color: '#ef4444',
                          '&:hover': { backgroundColor: '#fee2e2', transition: 'background-color 0.3s ease' },
                        }}
                        aria-label="Supprimer la région"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  Aucune région trouvée.
                </Typography>
              )}
            </Box>
          ) : (
            // Affichage sous forme de tableau sur desktop
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                maxHeight: '400px',
                overflow: 'auto',
                borderRadius: '12px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Table>
                <TableHead
                  sx={{
                    backgroundColor: '#f3f4f6',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: '0.85rem' }}>
                      <Checkbox
                        checked={selectedItems.length === regions.length}
                        indeterminate={selectedItems.length > 0 && selectedItems.length < regions.length}
                        onChange={handleSelectAll}
                        sx={{
                          padding: 0,
                          color: '#6b7280',
                          '&.Mui-checked': {
                            color: '#3b82f6',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: '0.85rem' }}>
                      <TableSortLabel
                        active={orderBy === 'nom_region'}
                        direction={orderBy === 'nom_region' ? order : 'asc'}
                        onClick={() => handleRequestSort('nom_region')}
                        sx={{ color: '#6b7280', '&:hover': { color: '#1f2937' } }}
                      >
                        Région
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: '0.85rem' }}>
                      <TableSortLabel
                        active={orderBy === 'nom_district'}
                        direction={orderBy === 'nom_district' ? order : 'asc'}
                        onClick={() => handleRequestSort('nom_district')}
                        sx={{ color: '#6b7280', '&:hover': { color: '#1f2937' } }}
                      >
                        District
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: '0.85rem' }}>
                      <TableSortLabel
                        active={orderBy === 'prix'}
                        direction={orderBy === 'prix' ? order : 'asc'}
                        onClick={() => handleRequestSort('prix')}
                        sx={{ color: '#6b7280', '&:hover': { color: '#1f2937' } }}
                      >
                        Prix (Ar)
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: '0.85rem' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRegions.length > 0 ? (
                    paginatedRegions.map((region, index) => (
                      <TableRow
                        key={region.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
                          '&:hover': {
                            backgroundColor: '#f3f4f6',
                            transition: 'background-color 0.3s ease',
                          },
                          '& td': { borderBottom: 'none' },
                        }}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(region.id)}
                            onChange={() => handleSelectItem(region.id)}
                            sx={{ padding: 0 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', color: '#1f2937' }}>{region.nom_region}</TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', color: '#1f2937' }}>
                          {region.nom_district || <Typography color="text.secondary">N/A</Typography>}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', color: '#1f2937' }}>{region.prix.prix}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpenDialog(region)}
                            sx={{
                              color: '#3b82f6',
                              '&:hover': { backgroundColor: '#dbeafe', transition: 'background-color 0.3s ease' },
                            }}
                            aria-label="Modifier la région"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setRegionToDelete(region);
                              setOpenDeleteDialog(true);
                            }}
                            sx={{
                              color: '#ef4444',
                              '&:hover': { backgroundColor: '#fee2e2', transition: 'background-color 0.3s ease' },
                            }}
                            aria-label="Supprimer la région"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: '#6b7280', fontSize: '0.9rem', py: 4 }}>
                        Aucune région trouvée.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        {/* Pagination */}
        <Grid item xs={12}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedRegions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-selectLabel': { fontSize: '0.85rem', color: '#6b7280' },
              '& .MuiTablePagination-displayedRows': { fontSize: '0.85rem', color: '#6b7280' },
              '& .MuiTablePagination-actions': { color: '#3b82f6' },
              '& .MuiTablePagination-toolbar': { justifyContent: 'flex-end', py: 1 },
            }}
          />
        </Grid>

        {/* Dialogue pour ajouter/modifier une région */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 300 }}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              borderTop: '4px solid #3b82f6',
              backgroundColor: '#fff',
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              textAlign: 'center',
              color: '#1f2937',
              py: 3,
              fontSize: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            {selectedRegion ? 'Modifier la région' : 'Ajouter une région'}
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <FormField
              autoFocus
              margin="dense"
              label="Nom de la région"
              placeholder="Entrez le nom de la région"
              type="text"
              fullWidth
              name="nom_region"
              value={formValues.nom_region}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: errors.nom_region ? 1 : 3 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="Réinitialiser le nom de la région">
                      <IconButton
                        onClick={resetRegionName}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            resetRegionName();
                          }
                        }}
                        sx={{
                          color: '#6b7280',
                          '&:hover': {
                            color: '#3b82f6',
                            transform: 'scale(1.1)',
                            transition: 'all 0.2s ease',
                          },
                        }}
                        aria-label="Réinitialiser le nom de la région"
                        tabIndex={0}
                      >
                        <LocationOn />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                'aria-label': errors.nom_region
                  ? `Nom de la région, erreur : ${errors.nom_region}`
                  : 'Nom de la région',
              }}
              error={!!errors.nom_region}
            />
            {errors.nom_region && <ErrorText>{errors.nom_region}</ErrorText>}
            <FormField
              margin="dense"
              label="Nom du district (optionnel)"
              placeholder="Entrez le nom du district"
              type="text"
              fullWidth
              name="nom_district"
              value={formValues.nom_district || ''}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 3 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="Réinitialiser le nom du district">
                      <IconButton
                        onClick={resetDistrictName}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            resetDistrictName();
                          }
                        }}
                        sx={{
                          color: '#6b7280',
                          '&:hover': {
                            color: '#3b82f6',
                            transform: 'scale(1.1)',
                            transition: 'all 0.2s ease',
                          },
                        }}
                        aria-label="Réinitialiser le nom du district"
                        tabIndex={0}
                      >
                        <Map />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              inputProps={{ 'aria-label': 'Nom du district' }}
            />
            <FormField
              margin="dense"
              label="Prix (Ar)"
              placeholder="Entrez le prix en Ariary"
              type="number"
              fullWidth
              name="prix"
              value={prixValue}
              onChange={handlePrixChange}
              variant="outlined"
              sx={{ mb: errors.prix ? 1 : 3 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="Réinitialiser le prix">
                      <IconButton
                        onClick={resetPrice}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            resetPrice();
                          }
                        }}
                        sx={{
                          color: '#6b7280',
                          '&:hover': {
                            color: '#3b82f6',
                            transform: 'scale(1.1)',
                            transition: 'all 0.2s ease',
                          },
                        }}
                        aria-label="Réinitialiser le prix"
                        tabIndex={0}
                      >
                        <AttachMoney />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                'aria-label': errors.prix
                  ? `Prix en Ariary, erreur : ${errors.prix}`
                  : 'Prix en Ariary',
                min: 0,
              }}
              error={!!errors.prix}
            />
            {errors.prix && <ErrorText>{errors.prix}</ErrorText>}
          </DialogContent>
          <DialogActions
            sx={{
              p: 3,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#f9fafb',
            }}
          >
            <CancelButton
              onClick={handleCloseDialog}
              variant="outlined"
              aria-label="Annuler l'ajout ou la modification"
            >
              Annuler
            </CancelButton>
            <PrimaryButton
              onClick={handleSave}
              variant="contained"
              disabled={Object.keys(errors).length > 0}
              aria-label="Enregistrer la région"
            >
              Enregistrer
            </PrimaryButton>
          </DialogActions>
        </Dialog>

        {/* Dialogue de confirmation de suppression */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle sx={{ fontWeight: 600, color: '#1f2937' }}>
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#1f2937' }}>
              {selectedItems.length > 0
                ? `Êtes-vous sûr de vouloir supprimer ${selectedItems.length} région(s) ?`
                : 'Êtes-vous sûr de vouloir supprimer cette région ?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                setOpenDeleteDialog(false);
                setRegionToDelete(null);
              }}
              variant="outlined"
              sx={{
                color: '#6b7280',
                borderColor: '#d1d5db',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f3f4f6',
                },
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              sx={{
                backgroundColor: '#ef4444',
                color: '#fff',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#dc2626',
                },
              }}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
};

export default LocationList;