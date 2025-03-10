import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Toolbar,
  Button,
  ButtonGroup,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Autocomplete,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { useAppDispatch } from "../hooks";

import SendIcon from "@mui/icons-material/Send";
import { setOrderDetails, setDuration } from "../redux/slices/commandeSlice";
import { fetchClients } from "../redux/features/clients/customersSlice";


// Interface pour définir le type de données d'un client
interface Client {
  id: number;
  lastName: string;
}

// Interface pour définir le type de données d'un produit
interface Product {
  id: number;
  name: string;
  price: number;
}

// Interface pour définir le type de données d'une ligne de commande
interface OrderLine {
  product: string;
  quantity: number;
  unitPrice: number;
  taxes: number;
  amount: number;
}

// Composant principal de la page de commande
const OrderPage: React.FC = () => {
  //const dispatch = useDispatch();
  const dispatch = useAppDispatch(); // Utilisation de `useAppDispatch()`

  //  États locaux
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  // Récupération des données depuis Redux
  const state = useSelector((state: any) => state);
  console.log("State Redux :", state);
  // clients
  const clients = state.customer ? state.customer.clients : [];
  const loading = useSelector((state: any) => state.customer.loading);
  const error = useSelector((state: any) => state.customer.error);
  const orderDetails = useSelector((state: any) => state.commande);

  //  Charger les clients au montage
  useEffect(() => {
    console.log("Fetching clients...");
    dispatch(fetchClients());
  }, [dispatch]);

  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(
    null
  );

  // Fonction pour gérer les changements dans les champs de texte
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(setOrderDetails({ [name]: value }));
  };

  // Fonction pour calculer la durée de la location en jours
  const calculateDuration = () => {
    const startDate = new Date(orderDetails.rentalStart);
    const endDate = new Date(orderDetails.rentalEnd);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      // Si les dates ne sont pas valides, mettez à jour la durée avec un message d'erreur
      dispatch(setDuration("Date invalide"));
      return;
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Mettez à jour la durée avec le nombre de jours
    dispatch(setDuration(`${diffDays} jours`));
  };

  // Hook useEffect pour recalculer la durée lorsque les dates de location changent
  useEffect(() => {
    calculateDuration();
  }, [orderDetails.rentalStart, orderDetails.rentalEnd]);

  // Fonction pour gérer le clic sur un bouton dans la barre d'outils
  const handleButtonClick = (index: number) => {
    setActiveButtonIndex(index);
  };

  const handleClientChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Client | null
  ) => {
    setSelectedClient(value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };
  {
    /*Liste destination*/
  }
  const destinations = [
    "Paris",
    "Londres",
    "New York",
    "Tokyo",
    "Berlin",
    // ... autres destinations
  ];
  {
    /*Liste Prix*/
  }
  const listePrixOptions = [
    "Tarif standard",
    "Tarif réduit",
    "Tarif premium",
    "Tarif spécial",
    // ... autres options
  ];

  {
    /**Date de creation*/
  }
  const [creationDate, setCreationDate] = useState(new Date());

  useEffect(() => {
    setCreationDate(new Date());
  }, []);
  const formattedDate = `${creationDate.getDate()}/${
    creationDate.getMonth() + 1
  }/${creationDate.getFullYear()}`;

  //fonction pour l'ajout de produit
  const productsList: Product[] = [
    { id: 1, name: "Produit A", price: 100 },
    { id: 2, name: "Produit B", price: 150 },
  ];

  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [amount, setAmount] = useState(0);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);

  // Ouvrir/Fermer le modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Calcul automatique du montant
  const calculateAmount = (qty: number, price: number, tax: number) =>
    qty * price + tax;

  // Mise à jour des champs
  const handleProductChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedProduct = productsList.find(
      (p) => p.name === event.target.value
    );
    setProduct(event.target.value);
    setUnitPrice(selectedProduct?.price || 0);
    setAmount(calculateAmount(quantity, selectedProduct?.price || 0, taxes));
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value) || 1;
    setQuantity(newQuantity);
    setAmount(calculateAmount(newQuantity, unitPrice, taxes));
  };

  const handleTaxesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTaxes = parseFloat(event.target.value) || 0;
    setTaxes(newTaxes);
    setAmount(calculateAmount(quantity, unitPrice, newTaxes));
  };

  // Ajouter le produit
  const handleAddProduct = () => {
    const newOrderLine: OrderLine = {
      product,
      quantity,
      unitPrice,
      taxes,
      amount,
    };
    setOrderLines([...orderLines, newOrderLine]);
    handleClose(); // Fermer le modal
  };

  const [formType, setFormType] = useState("proforma");

  //Devis

  // Rendu du composant
  return (
    <div>
      {/* Barre d'outils avec des boutons */}
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              startIcon={<SendIcon />}
              variant={activeButtonIndex === 0 ? "contained" : "outlined"}
              onClick={() => handleButtonClick(0)}
            >
              Envoyer par email
            </Button>
            <Button
              variant={activeButtonIndex === 1 ? "contained" : "outlined"}
              onClick={() => handleButtonClick(1)}
            >
              Confirmer
            </Button>
            <Button
              variant={activeButtonIndex === 2 ? "contained" : "outlined"}
              onClick={() => handleButtonClick(2)}
            >
              Preview
            </Button>
            <Button
              variant={activeButtonIndex === 3 ? "contained" : "outlined"}
              onClick={() => handleButtonClick(3)}
            >
              Annuler
            </Button>
          </ButtonGroup>
        </Box>
        <ButtonGroup
          variant="outlined"
          aria-label="outlined primary button group"
        >
          <Button
            variant={activeButtonIndex === 5 ? "contained" : "outlined"}
            onClick={() => setFormType("devis")}
          >
            Devis
          </Button>
          <Button
            variant={activeButtonIndex === 5 ? "contained" : "outlined"}
            onClick={() => handleButtonClick(5)}
          >
            Envoyé
          </Button>
          <Button
            variant={activeButtonIndex === 6 ? "contained" : "outlined"}
            onClick={() => handleButtonClick(6)}
          >
            Bon de commande
          </Button>
        </ButtonGroup>
      </Toolbar>

      {/* Affichage des erreurs */}
      {/* Message de chargement ou d'erreur */}
      {loading ? (
        <Typography>Chargement des clients...</Typography>
      ) : error ? (
        <Typography color="error">Erreur : {error}</Typography>
      ) : null}

      {/* Contenu principal de la page */}
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
            {/* Carte pour les détails de la commande */}
            <Card
              sx={{
                width: "100%",
                margin: "auto",
                padding: 2,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {formType === "proforma" ? "Proforma" : "Devis"}
                </Typography>

                <Grid item xs={3} marginTop={3}>
                  <Autocomplete
                    options={clients}
                    getOptionLabel={(client) => client.lastName}
                    value={selectedClient}
                    onChange={handleClientChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sélectionner un client"
                        value={
                          selectedClient
                            ? `Client : ${selectedClient.lastName}`
                            : ""
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid container spacing={2} sx={{ marginTop: 1 }}>
                  <Grid item xs={6}></Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="filled"
                      name="creationDate"
                      label="Date de création"
                      value={formattedDate}
                      InputProps={{
                        readOnly: true, // Empêche la modification manuelle de la date
                      }}
                    />

                    <TextField
                      fullWidth
                      variant="standard"
                      name="voiture"
                      label="Voiture"
                      value={orderDetails.voiture}
                      onChange={handleChange}
                    />
                    <Autocomplete
                      options={destinations}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="standard"
                          name="destination"
                          label="Destination"
                          value={orderDetails.destination}
                          onChange={handleChange}
                        />
                      )}
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        fullWidth
                        variant="filled"
                        name="rentalStart"
                        label="Date de départ"
                        type="date"
                        value={orderDetails.rentalStart}
                        onChange={handleChange}
                        sx={{ marginBottom: 2 }}
                        focused
                      />

                      <TextField
                        fullWidth
                        variant="filled"
                        name="rentalEnd"
                        label="Date de fin"
                        type="date"
                        value={orderDetails.rentalEnd}
                        onChange={handleChange}
                        sx={{ marginBottom: 2 }}
                        focused
                      />
                    </Box>

                    <TextField
                      fullWidth
                      variant="standard"
                      name="duration"
                      value={orderDetails.duration}
                      label="Durée"
                      InputProps={{
                        readOnly: true,
                      }}
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      variant="standard"
                      name="carburant"
                      value={orderDetails.carburant}
                      label="Carburant"
                      onChange={handleChange}
                    />
                    <Autocomplete
                      options={listePrixOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="standard"
                          name="listePrix"
                          label="Liste de prix"
                          value={orderDetails.listePrix}
                          onChange={handleChange}
                        />
                      )}
                    />
                    <TextField
                      fullWidth
                      variant="standard"
                      name="condtionPaiement"
                      value={orderDetails.condtionPaiement}
                      label="Condition de paiement"
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      variant="standard"
                      name="expiration"
                      value={orderDetails.expiration}
                      label="Expiration"
                      onChange={handleChange}
                      type="date"
                      focused
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ width: "100%", mt: 3 }}>
        {/* Onglets */}
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Lignes de la commande" />
          <Tab label="Autres informations" />
        </Tabs>

        {/* Contenu des onglets */}
        {tabIndex === 0 && (
          <Box sx={{ p: 2 }}>
            {/* Tableau des produits */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produit</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell>Prix unitaire</TableCell>
                  <TableCell>Taxes</TableCell>
                  <TableCell>Montant</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ borderBottom: "1px solid #ddd" }}
                  >
                    Aucun Commande trouvé.
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>

            {/* Boutons d'ajout */}
            <Box sx={{ mt: 2 }}>
              <div>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Ajouter un produit</DialogTitle>
                  <DialogContent>
                    <TextField
                      select
                      fullWidth
                      label="Produit"
                      value={product}
                      onChange={handleProductChange}
                      margin="dense"
                    >
                      {productsList.map((p) => (
                        <MenuItem key={p.id} value={p.name}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      label="Quantité"
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      margin="dense"
                    />

                    <TextField
                      fullWidth
                      label="Prix unitaire"
                      type="number"
                      value={unitPrice}
                      InputProps={{ readOnly: true }}
                      margin="dense"
                    />

                    <TextField
                      fullWidth
                      label="Taxes"
                      type="number"
                      value={taxes}
                      onChange={handleTaxesChange}
                      margin="dense"
                    />

                    <TextField
                      fullWidth
                      label="Montant total"
                      type="number"
                      value={amount}
                      InputProps={{ readOnly: true }}
                      margin="dense"
                    />
                  </DialogContent>

                  <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleAddProduct} variant="contained">
                      Ajouter
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              <Button variant="text" onClick={handleOpen}>
                Ajouter un produit
              </Button>
              <Button variant="text" color="primary">
                Ajouter une section
              </Button>
              <Button variant="text" color="primary">
                Ajouter une note
              </Button>
              <Button variant="text" color="primary">
                Catalog
              </Button>
            </Box>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="body1">Autres informations...</Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default OrderPage;