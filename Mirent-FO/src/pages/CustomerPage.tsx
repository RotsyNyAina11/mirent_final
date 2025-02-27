import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchClients,
  addClient,
  updateClient,
  deleteClient,
} from "../redux/slices/customersSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Avatar,
  Stack,
  Grid,
} from "@mui/material";

// Définition du type Customer
interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  logo: string;
}

const CustomerManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    logo: "",
  });

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrEditCustomer = async () => {
    if (editMode && selectedCustomer) {
      dispatch(updateClient({ id: selectedCustomer.id, ...form }));
    } else {
      dispatch(addClient(form));
    }
    handleCloseDialog();
  };

  const handleDeleteCustomer = (id: number) => {
    dispatch(deleteClient(id));
  };

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setForm(customer);
      setEditMode(true);
    } else {
      setSelectedCustomer(null);
      setForm({ firstName: "", lastName: "", email: "", phone: "", logo: "" });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCustomer(null);
    setEditMode(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", logo: "" });
  };

  return (
    <Box sx={{ maxWidth: "95%", margin: "auto", marginTop: 4 }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        Gestion des Clients
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Ajouter un Client
        </Button>
      </Box>

      {/* Boîte de dialogue pour l'ajout/modification */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          {editMode ? "Modifier Client" : "Ajouter Client"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Avatar
                src={form.logo}
                sx={{ width: 80, height: 80, margin: "auto" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="logo"
                type="file"
                fullWidth
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setForm({ ...form, logo: URL.createObjectURL(file) });
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="lastName"
                label="Nom"
                type="text"
                fullWidth
                value={form.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="firstName"
                label="Prénoms"
                type="text"
                fullWidth
                value={form.firstName}
                onChange={handleInputChange}
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Annuler
          </Button>
          <Button
            onClick={handleAddOrEditCustomer}
            color="primary"
            variant="contained"
          >
            {editMode ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Affichage des erreurs ou du chargement */}
      {loading && <Typography align="center">Chargement...</Typography>}
      {error && (
        <Typography align="center" color="error">
          {error}
        </Typography>
      )}

      {/* Tableau des clients */}
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#E2F0FB" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Logo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nom</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Prénoms</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Téléphone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Avatar src={customer.logo} />
                  </TableCell>
                  <TableCell>{customer.lastName}</TableCell>
                  <TableCell>{customer.firstName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        onClick={() => handleOpenDialog(customer)}
                        color="primary"
                      >
                        Modifier
                      </Button>
                      <Button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        color="error"
                      >
                        Supprimer
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Aucun client trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomerManagement;
