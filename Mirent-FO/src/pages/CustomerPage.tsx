import React, { useEffect, useState } from "react";
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
} from "@mui/material";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
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
  });

  const fetchCustomers = async () => {
    const response = await fetch("http://localhost:3001/customers");
    const data = await response.json();
    setCustomers(data);
  };

  const handleAddOrEditCustomer = async () => {
    const url = editMode
      ? `http://localhost:3001/customers/${selectedCustomer?.id}`
      : "http://localhost:3001/customers";
    const method = editMode ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpen(false);
    setEditMode(false);
    setSelectedCustomer(null);
    setForm({ firstName: "", lastName: "", email: "", phone: "" });
    fetchCustomers();
  };

  const handleDeleteCustomer = async (id: number) => {
    await fetch(`http://localhost:3001/customers/${id}`, { method: "DELETE" });
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Box sx={{ maxWidth: "80%", margin: "auto", marginTop: 4 }}>
      <Typography variant="h5" align="center">
        Gestion des Clients
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
          setEditMode(false);
        }}
      >
        Ajouter un Client
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  {customer.firstName} {customer.lastName}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setForm(customer);
                      setEditMode(true);
                      setOpen(true);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    color="error"
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup pour Ajouter/Modifier un Client */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editMode ? "Modifier le Client" : "Ajouter un Client"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Prénom"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Nom"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Téléphone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleAddOrEditCustomer} variant="contained">
            {editMode ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerManagement;
