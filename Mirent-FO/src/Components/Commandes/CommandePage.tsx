import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LocationOnIcon from "@mui/icons-material/LocationOn";
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
  InputAdornment,
  Paper,
} from "@mui/material";
import { useAppDispatch } from "../../hooks";

import SendIcon from "@mui/icons-material/Send";
import {
  setOrderDetails,
  setDuration,
  confirmOrder,
} from "../../redux/features/commande/commandeSlice";
import { fetchClients } from "../../redux/features/clients/customersSlice";
import { fetchRegions } from "../../redux/features/lieux/locationSlice";
import { Prix } from "../../types/region";
import { fetchVehicles } from "../../redux/features/vehicle/vehiclesSlice";

// Interface pour définir le type de données d'un client
interface Client {
  id: number;
  lastName: string;
}
//Interface pour definir le type de données d'une commande
interface Proforma {
  id: number;
  proformaNumber: string;
  contractReference: string;
  date: Date;
  client: Client;
  items: ProformaItem[];
  totalAmount: number;
  notes: string;
  vehicule: Vehicle[];
}

interface ProformaItem {
  id: number;
  vehicleId: number;
  regionId: number;
  prixId: number;
  dateDepart: Date;
  dateRetour: Date;
  nombreJours: number;
  subTotal: number;
  destination?: string; // Added destination property
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
// interface pour definir le type de données d'une region

interface Region {
  id: number;
  nom_region: string;
  nom_district: string;
  prix: Prix;
}

interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  immatriculation: string;
  nombrePlace: number;
  imageUrl: string;
  type: {
    id: number;
    type: string;
  };
  status: {
    id: number;
    status: string;
  };
  // ... autres propriétés de votre véhicule
}

const ButtonActions = {
  SEND_EMAIL: "SEND_EMAIL",
  CONFIRM: "CONFIRM",
  PREVIEW: "PREVIEW",
  CANCEL: "CANCEL",
  DEVIS: "DEVIS",
  SENT: "SENT",
  BON_COMMANDE: "BON_COMMANDE",
};

// Composant principal de la page de commande
const OrderPage: React.FC = () => {
  //const dispatch = useDispatch();
  const dispatch = useAppDispatch();

  // États locaux
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicule, setSelectedVehicule] = useState<Vehicle | null>(
    null
  );
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedRegion] = useState<Region | null>(null);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(
    null
  );
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [creationDate, setCreationDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [amount, setAmount] = useState(0);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [formType, setFormType] = useState("proforma");

  // Récupération des données depuis Redux
  const state = useSelector((state: any) => state);
  const clients = state.customer ? state.customer.clients : [];
  const loading = useSelector((state: any) => state.customer.loading);
  const error = useSelector((state: any) => state.customer.error);
  const orderDetails = useSelector((state: any) => state.commande);
  const regions = useSelector((state: any) => state.locations.regions);
  const loadingRegion = useSelector((state: any) => state.locations.loading);

  const vehicules = state.vehicles ? state.vehicles.vehicules : [];
  const loadingVehicules = useSelector(
    (state: any) => state.vehicles.loadingVehicules
  ); // Supposons un état de chargement dans Redux
  const errorVehicules = useSelector(
    (state: any) => state.vehicles.errorVehicules
  ); // Supposons un état d'erreur

  if (loadingVehicules) {
    return <div>Chargement des véhicules...</div>;
  }

  if (errorVehicules) {
    return <div>Erreur lors du chargement des véhicules.</div>;
  }

  console.log("State Redux :", state);

  //  Charger les clients au montage
  useEffect(() => {
    console.log("Fetching clients...");
    dispatch(fetchClients());
  }, [dispatch]);

  // Charger les régions au montage
  useEffect(() => {
    console.log("Fetching regions...");
    dispatch(fetchRegions());
  }, [dispatch]);
  console.log("Regions chargées :", regions);
  console.log("Erreur :", error);
  if (loadingRegion) return <p>Chargement des régions...</p>;
  if (!regions) return <p>Erreur : Aucune région trouvée.</p>;

  useEffect(() => {
    console.log("Fetching vehicule...");
    dispatch(fetchVehicles());
  }, [dispatch]);

  // Fonction pour gérer les changements dans les champs de texte
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(setOrderDetails({ [name]: value }));
  };

  // Fonction pour calculer la durée de la location en jours
  const calculateDuration = () => {
    const startDate = new Date(orderDetails.dateDepart);
    const endDate = new Date(orderDetails.dateRetour);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      // Si les dates ne sont pas valides, mettez à jour la durée avec un message d'erreur
      dispatch(setDuration(String("Date invalide"))); // Use "NaN" as a string to indicate an invalid date
      return;
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Mettez à jour la durée avec le nombre de jours
    dispatch(setDuration(diffDays.toString()));
  };

  // Hook useEffect pour recalculer la durée lorsque les dates de location changent
  useEffect(() => {
    calculateDuration();
  }, [orderDetails.dateDepart, orderDetails.dateRetour]);

  const handleButtonClick = (action: string, index?: number) => {
    if (index !== undefined) {
      setActiveButtonIndex(index);
    }
    switch (action) {
      case ButtonActions.SEND_EMAIL:
        console.log("Envoyer par email");
        break;
      case ButtonActions.CONFIRM:
        console.log("Confirmer la commande");
        setConfirmationMessage("Commande confirmée !");
        setTimeout(() => {
          setConfirmationMessage("");
        }, 3000);
        break;
      case ButtonActions.PREVIEW:
        console.log("Prévisualiser");
        break;
      case ButtonActions.CANCEL:
        console.log("Annuler");
        break;
      case ButtonActions.DEVIS:
        console.log("Devis");
        setFormType("devis");
        break;
      case ButtonActions.SENT:
        console.log("Envoyé");
        break;
      case ButtonActions.BON_COMMANDE:
        console.log("Bon de commande");
        break;
      default:
        break;
    }
  };

  const handleClientChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Client | null
  ) => {
    setSelectedClient(value);
  };

  const handleVehiculeChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Vehicle | null
  ) => {
    setSelectedVehicule(value);
    // Vous pouvez également mettre à jour d'autres états ou déclencher des actions Redux ici
    dispatch(setOrderDetails({ vehicleId: value?.id })); // Exemple: enregistrer l'ID du véhicule dans votre state de commande
  };

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

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

  const effectuerActionDeConfirmation = async () => {
    try {
      const apiUrl = "http://localhost:3000/proforma";

      // Vérifier si un client est sélectionné
      const clientId = selectedClient?.id;
      if (!clientId) {
        setConfirmationMessage("Veuillez sélectionner un client.");
        setTimeout(() => setConfirmationMessage(""), 3000);
        return;
      }

      // Vérifier si des véhicules ont été ajoutés à la proforma
      if (!orderLines || orderLines.length === 0) {
        setConfirmationMessage(
          "Veuillez ajouter au moins un véhicule à la proforma."
        );
        setTimeout(() => setConfirmationMessage(""), 3000);
        return;
      }

      // Extraction des détails nécessaires
      const { dateDepart, dateRetour, notes } = orderDetails || {};

      // Vérification de la sélection de région et de prix
      if (!selectedRegion || !selectedRegion.id || !selectedRegion.prix?.id) {
        setConfirmationMessage("Veuillez sélectionner une région et un prix.");
        setTimeout(() => setConfirmationMessage(""), 3000);
        return;
      }

      // Transformation des données pour le backend
      const itemsToSend = orderLines.map((line) => {
        const vehicleId = line.product?.match(/\d+/)?.[0]; // Extraction plus sûre de l'ID
        return {
          vehicleId: vehicleId ? parseInt(vehicleId) : null,
          regionId: selectedRegion.id,
          prixId: selectedRegion.prix.id,
          dateDepart,
          dateRetour,
        };
      });

      // Vérification que tous les vehicleId sont valides
      if (itemsToSend.some((item) => item.vehicleId === null)) {
        setConfirmationMessage(
          "Erreur : certains véhicules ont des identifiants invalides."
        );
        setTimeout(() => setConfirmationMessage(""), 3000);
        return;
      }

      // Préparation des données pour l'envoi
      const proformaDataToSend = {
        clientId,
        date: new Date().toISOString(),
        notes,
        items: itemsToSend,
      };

      // Envoi des données au backend
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proformaDataToSend),
      });

      // Gestion des erreurs du backend
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de la création de la proforma:", errorData);
        setConfirmationMessage(
          `Erreur: ${errorData.message || "La création a échoué."}`
        );
        return;
      }

      // Récupération et affichage des données retournées par l'API
      const data = await response.json();
      console.log("Proforma créée avec succès:", data);
      setConfirmationMessage("Proforma créée avec succès !");
    } catch (error) {
      console.error("Erreur réseau lors de la création de la proforma:", error);
      setConfirmationMessage(
        "Erreur réseau lors de la création de la proforma."
      );
    } finally {
      setTimeout(() => setConfirmationMessage(""), 3000);
    }
  };

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
              onClick={() => handleButtonClick(ButtonActions.SEND_EMAIL, 0)}
            >
              Envoyer par email
            </Button>
            <Button
              variant={activeButtonIndex === 1 ? "contained" : "outlined"}
              onClick={() => {
                handleButtonClick(ButtonActions.CONFIRM, 1);
                effectuerActionDeConfirmation(); // Call the function here
              }}
            >
              Confirmer
            </Button>

            <Button
              variant={activeButtonIndex === 2 ? "contained" : "outlined"}
              onClick={() => handleButtonClick(ButtonActions.PREVIEW, 2)}
            >
              Preview
            </Button>
            <Button
              variant={activeButtonIndex === 3 ? "contained" : "outlined"}
              onClick={() => handleButtonClick(ButtonActions.CANCEL, 3)}
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
            variant={activeButtonIndex === 4 ? "contained" : "outlined"}
            onClick={() => handleButtonClick(ButtonActions.DEVIS, 4)}
          >
            Devis
          </Button>
          <Button
            variant={activeButtonIndex === 5 ? "contained" : "outlined"}
            onClick={() => handleButtonClick(ButtonActions.SENT, 5)}
          >
            Envoyé
          </Button>
          <Button
            variant={activeButtonIndex === 6 ? "contained" : "outlined"}
            onClick={() => handleButtonClick(ButtonActions.BON_COMMANDE, 6)}
          >
            Bon de commande
          </Button>
        </ButtonGroup>
      </Toolbar>

      {confirmationMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "lightgreen",
            padding: "20px",
            borderRadius: "8px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          {confirmationMessage}
        </div>
      )}
      <Typography variant="body1" paragraph sx={{ fontSize: "0.9rem" }}>
        Ici, vous pouvez gérer les commandes de location de votre agence.
      </Typography>

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
                  {orderDetails.proformaNumber}
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
                      name="date"
                      label="Date de création"
                      value={formattedDate}
                      InputProps={{
                        readOnly: true, // Empêche la modification manuelle de la date
                      }}
                    />

                    <Autocomplete
                      options={Array.isArray(vehicules) ? vehicules : []}
                      getOptionLabel={(vehicule) => vehicule.nom || vehicule.id}
                      value={selectedVehicule}
                      onChange={handleVehiculeChange}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sélectionner un véhicule"
                          variant="standard"
                          value={
                            selectedVehicule
                              ? `Vehicule : ${selectedVehicule.id}`
                              : ""
                          }
                        />
                      )}
                    />
                    <Autocomplete
                      options={Array.isArray(regions) ? regions : []}
                      getOptionLabel={(region) =>
                        region ? region.nom_region : ""
                      } // Utiliser nom_region pour l'affichage
                      value={
                        Array.isArray(regions)
                          ? regions.find(
                              (region) =>
                                region.regionId === orderDetails.regionId
                            ) || null
                          : null
                      }
                      onChange={(event, newValue) => {
                        dispatch(
                          setOrderDetails({
                            regionId: newValue ? newValue.regionId : "",
                          })
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="standard"
                          label="Destination"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {params.InputProps.endAdornment}
                                <InputAdornment position="end">
                                  <LocationOnIcon color="action" />
                                </InputAdornment>
                              </>
                            ),
                          }}
                        />
                      )}
                      PaperComponent={(props) => (
                        <Paper
                          elevation={3}
                          sx={{ borderRadius: 2, overflow: "hidden" }}
                          {...props}
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li
                          {...props}
                          style={{
                            padding: "10px",
                            backgroundColor: selected
                              ? "#f0f0f0"
                              : "transparent",
                            cursor: "pointer",
                            borderBottom: "1px solid #ddd",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                          <Box display="flex" flexDirection="column">
                            <Typography
                              variant="body1"
                              fontWeight={selected ? "bold" : "normal"}
                            >
                              {option.nom_region}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {option.nom_district} - {option.prix?.prix} Ar
                            </Typography>
                          </Box>
                        </li>
                      )}
                    />
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        fullWidth
                        variant="standard"
                        name="dateDepart"
                        label="Date de départ"
                        type="date"
                        value={orderDetails.dateDepart}
                        onChange={handleChange}
                        sx={{ marginBottom: 2 }}
                        focused
                      />

                      <TextField
                        fullWidth
                        variant="standard"
                        name="dateRetour"
                        label="Date de retour"
                        type="date"
                        value={orderDetails.dateRetour}
                        onChange={handleChange}
                        sx={{ marginBottom: 2 }}
                        focused
                      />
                    </Box>

                    <TextField
                      fullWidth
                      variant="standard"
                      name="nombreJours"
                      value={orderDetails.nombreJours}
                      label="Nombre de jours"
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

                    <TextField
                      fullWidth
                      variant="standard"
                      name="prixId"
                      value={orderDetails.prixId}
                      label="Prix unitaire"
                      onChange={handleChange}
                      type="prix"
                      focused
                    />
                    {/*
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
                      name="notes"
                      value={orderDetails.notes}
                      label="Notes"
                      onChange={handleChange}
                      multiline
                      rows={4}
                    />
                    <TextField
                      fullWidth
                      variant="standard"
                      name="subTotal"
                      value={orderDetails.subTotal}
                      label="Taxes"
                      onChange={handleChange}
                      type="prix"
                      focused
                    />
                    */}

                    <TextField
                      fullWidth
                      variant="standard"
                      name="totalAmount"
                      value={orderDetails.totalAmount}
                      label="Montant total"
                      onChange={handleChange}
                      type="prix"
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
                  <TableCell>Voiture</TableCell>
                  <TableCell>Marque</TableCell>
                  <TableCell>Modèle </TableCell>
                  <TableCell>Immatriculation</TableCell>
                  <TableCell>Nombre de place</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
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
