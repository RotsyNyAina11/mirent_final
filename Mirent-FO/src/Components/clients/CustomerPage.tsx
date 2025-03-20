import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchClients,
  addClient,
  updateClient,
  deleteClient,
} from "../../redux/features/clients/customersSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  TablePagination,
  TableSortLabel,
  Fab,
  Tooltip,
  InputAdornment,
  Stack,
  Grid,
  Button,
} from "@mui/material";
import { Edit, Delete, Add, SearchOutlined, Person, Email, Phone, PhotoCamera } from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// Thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Bleu principal
    },
    secondary: {
      main: "#ff4081", // Rose secondaire
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      color: "#333",
    },
  },
});

// Style pour l'effet neumorphisme
const NeumorphicFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: 24,
  right: 24,
  boxShadow: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff",
  },
}));

interface Customer {
  id: number;
  lastName: string;
  email: string;
  phone: string;
  logo: string;
}

const CustomerManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, loading, error } = useSelector((state: RootState) => state.customer);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({ lastName: "", email: "", phone: "", logo: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Customer>("lastName");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDeleteCustomer = (id: number) => {
    dispatch(deleteClient(id));
    setSnackbarMessage("Client supprimé avec succès !");
    setSnackbarOpen(true);
  };

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setForm(customer);
      setEditMode(true);
    } else {
      setSelectedCustomer(null);
      setForm({ lastName: "", email: "", phone: "", logo: "" });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCustomer(null);
    setEditMode(false);
    setForm({ lastName: "", email: "", phone: "", logo: "" });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  const paginatedClients = filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof Customer) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedClients = React.useMemo(() => {
    return [...paginatedClients].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    });
  }, [paginatedClients, order, orderBy]);

  const validateForm = () => {
    let isValid = true;
    const errors = { lastName: "", email: "", phone: "" };
    if (!form.lastName.trim()) {
      errors.lastName = "Nom requis.";
      isValid = false;
    }
    if (!form.email.trim()) {
      errors.email = "Email requis.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Email invalide.";
      isValid = false;
    }
    if (!form.phone.trim()) {
      errors.phone = "Téléphone requis.";
      isValid = false;
    }
    return isValid;
  };

  const handleAddOrEditCustomer = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      if (editMode && selectedCustomer) {
        await dispatch(updateClient({ id: selectedCustomer.id, ...form }));
        setSnackbarMessage("Client modifié avec succès !");
      } else {
        await dispatch(addClient(form));
        setSnackbarMessage("Client ajouté avec succès !");
      }
      dispatch(fetchClients());
      handleCloseDialog();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification du client :", error);
      setSnackbarMessage("Une erreur s'est produite !");
      setSnackbarOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: "95%", margin: "auto", mt: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            Gestion des Clients
          </Typography>
          <TextField
            label="Rechercher un client..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
            sx={{ width: "250px" }}
          />
        </Box>

        {/* Tableau */}
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            overflowX: "auto",
            mt: 2,
            borderRadius: 2,
            boxShadow: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Logo</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "lastName"}
                    direction={orderBy === "lastName" ? order : "asc"}
                    onClick={() => handleRequestSort("lastName")}
                    sx={{ fontWeight: "bold", color: "#555" }}
                  >
                    Nom
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "email"}
                    direction={orderBy === "email" ? order : "asc"}
                    onClick={() => handleRequestSort("email")}
                    sx={{ fontWeight: "bold", color: "#555" }}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "phone"}
                    direction={orderBy === "phone" ? order : "asc"}
                    onClick={() => handleRequestSort("phone")}
                    sx={{ fontWeight: "bold", color: "#555" }}
                  >
                    Téléphone
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedClients.length > 0 ? (
                sortedClients.map((client) => (
                  <TableRow
                    key={client.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f0f4f8", transition: "background-color 0.3s ease" },
                    }}
                  >
                    <TableCell>
                      <Avatar
                        src={client.logo || "/default-avatar.png"} // Image par défaut si aucune n'est fournie
                        alt={client.lastName}
                        sx={{ width: 40, height: 40 }}
                      />
                    </TableCell>
                    <TableCell>{client.lastName}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => handleOpenDialog(client)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteCustomer(client.id)} color="error">
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Aucun client trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #ddd",
            "& .MuiTablePagination-selectLabel": { fontSize: "0.875rem", color: "#555" },
            "& .MuiTablePagination-displayedRows": { fontSize: "0.875rem", color: "#555" },
          }}
        />

        {/* Bouton flottant avec effet neumorphisme */}
        <Tooltip title="Ajouter un client" placement="left">
          <NeumorphicFab color="primary" aria-label="add" onClick={() => handleOpenDialog()}>
            <Add />
          </NeumorphicFab>
        </Tooltip>

        {/* Dialogue pour ajouter/modifier un client */}
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
              borderBottom: "1px solid #eee",
              py: 2,
            }}
          >
            {editMode ? "Modifier Client" : "Ajouter Client"}
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Stack direction="column" alignItems="center" spacing={2}>
                  <Avatar
                    src={form.logo || "/default-avatar.png"} // Image par défaut si aucune n'est fournie
                    alt="Logo"
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "#f0f4f8",
                      border: "2px solid #e0e0e0",
                    }}
                  />
                  <IconButton
                    color="primary"
                    component="label"
                    sx={{
                      bgcolor: "#e3f2fd",
                      p: 1.5,
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "#bbdefb",
                      },
                    }}
                  >
                    <PhotoCamera />
                    <input
                      hidden
                      type="file"
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          setForm({ ...form, logo: URL.createObjectURL(file) });
                        }
                      }}
                    />
                  </IconButton>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="lastName"
                  label="Nom"
                  type="text"
                  fullWidth
                  value={form.lastName}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={form.email}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="phone"
                  label="Téléphone"
                  type="text"
                  fullWidth
                  value={form.phone}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              p: 2,
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={handleCloseDialog}
              color="error"
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddOrEditCustomer}
              color="primary"
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              {editMode ? "Modifier" : "Ajouter"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{
              width: "100%",
              backgroundColor: "#4caf50",
              color: "#fff",
              "& .MuiAlert-icon": {
                color: "#fff",
              },
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerManagement;