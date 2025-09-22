import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Tooltip,
  TablePagination, // Ajout de l'import
  Alert,
  Snackbar, // Ajout des imports pour les notifications
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, People as PeopleIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { styled, createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { addClient, deleteClient, fetchClients, updateClient } from "../../../redux/features/clients/customersSlice";

const theme = createTheme({
  palette: {
    primary: { main: "#3b82f6" },
    secondary: { main: "#ef4444" },
    background: { default: "#f9fafb" },
    text: { primary: "#1f2937", secondary: "#6b7280" },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, color: "#1f2937" },
    h6: { fontWeight: 600, color: "#1f2937" },
    body1: { fontSize: "0.9rem", color: "#1f2937" },
    body2: { fontSize: "0.85rem", color: "#6b7280" },
  },
});

const DashboardCard = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  transition: "box-shadow 0.3s ease, transform 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.01)",
  },
}));

const CustomerManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, loading, error } = useSelector((state: RootState) => state.customer);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // État pour la confirmation de suppression
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientToDelete, setClientToDelete] = useState<{id: number, name: string} | null>(null); // Client à supprimer
  const [searchTerm, setSearchTerm] = useState("");
  
  // États pour la pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // États pour les notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  // Filtrer les clients
  const filteredClients = clients.filter((c) =>
    c.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion du changement de page
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Gestion du changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculer les clients à afficher pour la page courante
  const paginatedClients = filteredClients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenDialog = (client?: any) => {
    setSelectedClient(client || { lastName: "", email: "", phone: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClient(null);
  };

  const handleSaveClient = () => {
    if (selectedClient.id) {
      dispatch(updateClient(selectedClient));
      setSnackbar({
        open: true,
        message: 'Client modifié avec succès',
        severity: 'success'
      });
    } else {
      dispatch(addClient(selectedClient));
      setSnackbar({
        open: true,
        message: 'Client ajouté avec succès',
        severity: 'success'
      });
    }
    handleCloseDialog();
  };

  // Ouvrir la confirmation de suppression
  const handleOpenDeleteConfirm = (id: number, name: string) => {
    setClientToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  // Fermer la confirmation de suppression
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setClientToDelete(null);
  };

  // Supprimer un client après confirmation
  const handleConfirmDelete = () => {
    if (!clientToDelete) return;
    
    dispatch(deleteClient(clientToDelete.id))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: `Client "${clientToDelete.name}" supprimé avec succès.`,
          severity: "success",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Échec de la suppression du client.",
          severity: "error",
        });
      });
    
    handleCloseDeleteConfirm();
  };

  const stats = useMemo(() => {
    const total = clients.length;
    const newClients = clients.filter((c: any) => {
      const createdAt = new Date(c.createdAt || Date.now());
      const diff = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length;

    return [
      { title: "Total Clients", value: total, icon: <PeopleIcon fontSize="large" color="primary" />, bg: "#e3f2fd" },
      { title: "Nouveaux Clients", value: newClients, icon: <PersonAddIcon fontSize="large" color="success" />, bg: "#e8f5e9" },
    ];
  }, [clients]);

  const handleExportCSV = () => {
    const header = ["Nom", "Email", "Téléphone"];
    const rows = filteredClients.map(c => [c.lastName, c.email, c.phone]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().split("T")[0];
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `clients_${dateStr}.csv`);
    link.click();

    setSnackbar({
      open: true,
      message: "Export CSV effectué.",
      severity: "info",
    });
  };

  // Fermer la notification
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ px: isMobile ? 2 : 3, py: 2, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        {/* Header et description */}
        <Grid container spacing={1} mb={3} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">Gestion des Clients</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Consultez, ajoutez, modifiez ou exportez les informations des clients facilement.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            display="flex"
            justifyContent={isMobile ? "flex-start" : "flex-end"}
            gap={1}
            mt={isMobile ? 1 : 0}
          >
            <TextField
              size="small"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: "8px", minWidth: 140 }}
            />
            <Tooltip title="Ajouter un nouveau client">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ borderRadius: "8px", textTransform: "none", minHeight: 36, fontSize: "0.8rem", px: 2 }}
              >
                Ajouter
              </Button>
            </Tooltip>
            <Tooltip title="Exporter la liste des clients en CSV">
              <Button
                variant="outlined"
                onClick={handleExportCSV}
                sx={{ borderRadius: "8px", textTransform: "none", minHeight: 36, fontSize: "0.8rem", px: 2 }}
              >
                Export CSV
              </Button>
            </Tooltip>
          </Grid>
        </Grid>

        {/* Affichage des erreurs */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Cartes de stats */}
        <Grid container spacing={2} mb={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  backgroundColor: stat.bg,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {stat.icon}
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">{stat.title}</Typography>
                      <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tableau clients */}
        <DashboardCard>
          <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Chargement...</TableCell>
                  </TableRow>
                ) : paginatedClients.length > 0 ? (
                  paginatedClients.map((client) => (
                    <TableRow key={client.id} hover>
                      <TableCell>{client.lastName}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Modifier ce client">
                          <IconButton onClick={() => handleOpenDialog(client)} color="primary" size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer ce client">
                          <IconButton 
                            onClick={() => handleOpenDeleteConfirm(client.id, client.lastName)} 
                            color="secondary" 
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Aucun client trouvé.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {filteredClients.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 0
              }}>
                <Typography variant="body2" color="text.secondary">
                  {`${filteredClients.length} client(s) au total`}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredClients.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Lignes par page"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                    sx={{
                      '& .MuiTablePagination-toolbar': {
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end',
                        gap: 2
                      }
                    }}
                  />
                </Box>
              </Box>
            )}
          </TableContainer>
        </DashboardCard>

        {/* Dialog ajout/édition */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>{selectedClient?.id ? "Modifier Client" : "Ajouter Client"}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Nom"
              value={selectedClient?.lastName || ""}
              onChange={(e) => setSelectedClient({ ...selectedClient, lastName: e.target.value })}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Email"
              value={selectedClient?.email || ""}
              onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Téléphone"
              value={selectedClient?.phone || ""}
              onChange={(e) => setSelectedClient({ ...selectedClient, phone: e.target.value })}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleSaveClient} variant="contained">Enregistrer</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
          <DialogTitle sx={{ fontWeight: 600 }}>
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <Typography>
              Êtes-vous sûr de vouloir supprimer le client "{clientToDelete?.name}" ? Cette action est irréversible.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCloseDeleteConfirm} color="inherit">
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar pour les notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerManagement;