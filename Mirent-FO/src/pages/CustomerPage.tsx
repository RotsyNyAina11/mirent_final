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
//import image from "../assets/logo.png";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  logo: string;
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
    logo: "",
  });

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3000/clients");
      const data = await response.json();
      console.log("Données reçues :", data); // Vérifie la structure

      // Assurer que `data` est bien un tableau avant de le stocker
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des clients :", error);
      setCustomers([]); // Évite l'erreur `map()` en mettant un tableau vide
    }
  };

  const handleAddOrEditCustomer = async () => {
    const url = editMode
      ? `http://localhost:3000/clients/${selectedCustomer?.id}`
      : "http://localhost:3000/clients";
    const method = editMode ? "PUT" : "POST";

    // Assurez-vous que tous les champs requis sont présents
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      logo: form.logo || "default-logo.png", // Valeur par défaut si le logo est manquant
    };

    try {
      console.log("Données envoyées :", payload); // Log les données envoyées

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Réponse de l'API :", data); // Log la réponse

      if (response.ok) {
        setOpen(false);
        setEditMode(false);
        setSelectedCustomer(null);
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          logo: "",
        });
        fetchCustomers();
      } else {
        console.error("Erreur lors de la modification/ajout du client :", data);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    await fetch(`http://localhost:3000/clients/${id}`, { method: "DELETE" });
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Box sx={{ maxWidth: "100%", margin: "auto", marginTop: 4 }}>
      <Typography variant="h5" align="center">
        Gestion des Clients
      </Typography>

      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
          setEditMode(true);
        }}
      >
        Ajouter un Client
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#E2F0FB" }}>
            <TableRow>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Nom
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Prénoms
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Téléphone
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Aucun client trouvé
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.lastName}</TableCell>
                  <TableCell>{customer.firstName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setForm(customer);
                        setEditMode(true);
                        setOpen(true);
                        console.log(
                          "Client sélectionné pour modification :",
                          customer
                        ); // Log le client sélectionné
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
              ))
            )}
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
          <Button onClick={() => setOpen(false)} color="error">
            Annuler
          </Button>
          <Button onClick={handleAddOrEditCustomer} variant="contained">
            {editMode ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerManagement;
