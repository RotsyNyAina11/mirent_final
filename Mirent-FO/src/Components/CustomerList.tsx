import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Définition du type Client
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const ClientList: React.FC = () => {
  // État pour stocker la liste des clients
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "Alice Dupont",
      email: "alice@example.com",
      phone: "+261 34 12 345 67",
      address: "Antananarivo, Madagascar",
    },
    {
      id: 2,
      name: "Jean Rakoto",
      email: "jean@example.com",
      phone: "+261 33 44 555 66",
      address: "Toamasina, Madagascar",
    },
  ]);

  // État pour stocker le nouveau client
  const [newClient, setNewClient] = useState<Client>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  // Fonction pour ajouter un client
  const handleAddClient = () => {
    if (
      !newClient.name ||
      !newClient.email ||
      !newClient.phone ||
      !newClient.address
    ) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    setClients([...clients, { ...newClient, id: clients.length + 1 }]);
    setNewClient({ id: 0, name: "", email: "", phone: "", address: "" }); // Réinitialiser le formulaire
  };

  // Fonction pour supprimer un client
  const handleDeleteClient = (id: number) => {
    setClients(clients.filter((client) => client.id !== id));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Liste des Clients
      </Typography>

      {/* Formulaire d'ajout de client */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Ajouter un Client
        </Typography>
        <Box style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <TextField
            label="Nom"
            name="name"
            value={newClient.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={newClient.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Téléphone"
            name="phone"
            value={newClient.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Adresse"
            name="address"
            value={newClient.address}
            onChange={handleChange}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClient}
            style={{ marginTop: 10 }}
          >
            Ajouter
          </Button>
        </Box>
      </Paper>

      {/* Tableau des clients */}

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClientList;
