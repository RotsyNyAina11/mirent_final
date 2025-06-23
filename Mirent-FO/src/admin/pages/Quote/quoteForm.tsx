<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React, { useState, useEffect, useRef } from "react";
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  DialogTitle,
<<<<<<< HEAD
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { differenceInDays, format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { fetchVehicles } from '../../../redux/features/vehicle/vehiclesSlice';
import { fetchRegions } from '../../../redux/features/lieux/locationSlice';
import { addClient, fetchClients } from '../../../redux/features/clients/customersSlice';
import { createDevis, CreateDevisDto, fetchDevis } from '../../../redux/features/devis/devisSlice';
import QuotePreviewDialog from '../../Components/Quote/quoteDialog';
=======
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { differenceInDays, format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  addClient,
  fetchClients,
} from "../../../redux/features/clients/customersSlice";
import { useAppDispatch } from "../../../hooks";
import { Prix, Region } from "../../../types/region";
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763

// Extend the Window interface to include html2canvas and jspdf
declare global {
  interface Window {
    html2canvas?: any;
    jspdf?: any;
  }
}

<<<<<<< HEAD
// Interfaces
interface Client {
  id: string;
  lastName: string;
=======
// Interface for Vehicle and Destination remain unchanged
interface Vehicle {
  id: string;
  nom: string;
  status: {
    status: string;
    [key: string]: any;
  };
  // Uncomment and add these if your backend provides them
  marque?: string;
  immatriculation?: string;
}

interface Destination {
  id: string;
  name: string;
  price: number;
}

interface Region {
  id: string;
  nom_district: string;
  nom_region: string;
  prix: Prix;
}

// Interface for Client (aligned with Customer type from clientSlice)
interface Client {
  id: string;
  name: string;
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
  email: string;
  phone: string;
  address?: string;
}

<<<<<<< HEAD
interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  immatriculation: string;
  nombrePlace: number;
  imageUrl: string;
  type: { id: number; type: string };
  status: { id: number; status: string };
}

// Custom Material-UI theme
=======
// DTO for creating a devis (quote) on the backend
interface CreateDevisDto {
  clientId: string;
  startDate: string;
  endDate: string;
  includesFuel: boolean;
  fuelCostPerDay?: number;
  items: Array<{
    regionId: number;
    vehiculeId: number;
    quantity: number;
  }>;
  // Add other fields if your backend expects them
}

interface DevisItem {
  regionId: number;
  vehiculeId: number;
  quantity: number;
  unitPrice: number; // Price per unit for this item
  regionName?: string; // Optional, as it's processed by backend
  vehiculeDetails?: {
    nom: string;
    marque: string;
    modele: string;
    immatriculation: string;
    nombrePlace: number;
    type: string;
    imageUrl?: string;
  };
}

interface DevisData {
  id: string;
  clientId: string;
  items: DevisItem[];
  startDate: string; // Backend sends ISO date string (e.g., "2023-10-26T00:00:00.000Z")
  endDate: string; // Backend sends ISO date string
  includesFuel: boolean;
  fuelCostPerDay?: number; // Optional, only present if includesFuel is true
  totalAmount: number; // The final calculated total from the backend
  // Add any other properties from your Devis entity that you might need
}

// Custom Material-UI theme remains unchanged
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
const theme = createTheme({
  palette: {
    primary: { main: "#2a52be" },
    secondary: { main: "#dc004e" },
    success: { main: "#2e7d32" },
    info: { main: "#03a9f4" },
    warning: { main: "#ff9800" },
    error: { main: "#f44336" },
    background: { default: "#f4f6f8", paper: "#ffffff" },
  },
  typography: {
<<<<<<< HEAD
    fontFamily: 'Roboto, sans-serif',
    body1: { fontSize: '0.95rem', color: '#333' },
    caption: { fontSize: '0.75rem', color: '#555' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: '8px', textTransform: 'none' } } },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: '8px', boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.12)' } },
=======
    fontFamily: "Roboto, sans-serif",
    h4: { fontWeight: 700, fontSize: "2.1rem" },
    h5: { fontWeight: 600, fontSize: "1.6rem" },
    h6: { fontWeight: 500, fontSize: "1.25rem" },
    subtitle1: { fontSize: "1rem", color: "#333" },
    body1: { fontSize: "0.95rem", color: "#333" },
    caption: { fontSize: "0.75rem", color: "#555" },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: "8px", textTransform: "none" } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "8px",
          boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.12)",
        },
      },
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
    },
  },
});

const QuoteForm: React.FC = () => {
  const dispatch = useAppDispatch();
<<<<<<< HEAD
  const { vehicles, vehiclesLoading, vehiclesError } = useSelector(
    (state: RootState) => state.vehicles
  );
  const { regions, status: regionsStatus, error: regionsError } = useSelector(
    (state: RootState) => state.locations
  );
  const { clients, loading: clientsLoading, error: clientsError } = useSelector(
    (state: RootState) => state.customer
  );
  const { devis, loading: devisLoading, error: devisError } = useSelector(
    (state: RootState) => state.devis
  );

  // State variables
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [openClientDialog, setOpenClientDialog] = useState<boolean>(false);
  const [newClient, setNewClient] = useState<Client>({
    id: '',
    lastName: '',
    email: '',
    phone: '',
=======
  const { clients, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  // Local loading state for internal async operations
  const [loadingLocal, setLoading] = useState<boolean>(false);

  // State variables (remove clients state as it's now managed by Redux)
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [openClientDialog, setOpenClientDialog] = useState<boolean>(false);
  const [newClient, setNewClient] = useState<Client>({
    id: "",
    name: "",
    email: "",
    phone: "",
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
  });
  const [erreur, setError] = useState<string>("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string | number>("");
  const [regionsError, setRegionsError] = useState<string | null>(null);
  const [loadingRegions, setLoadingRegions] = useState<boolean>(false);
  const [quoteDate, setQuoteDate] = useState<Date | null>(new Date());
  const [expirationDate, setExpirationDate] = useState<Date | null>(
    addDays(new Date(), 30)
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [withFuel, setWithFuel] = useState<boolean>(false);
  const [estimatedFuelPrice, setEstimatedFuelPrice] = useState<number>(0);
  const [finalTotalPrice, setFinalTotalPrice] = useState<number>(0);
  const [quoteNumber, setQuoteNumber] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
<<<<<<< HEAD
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');
  const previewContentRef = useRef<HTMLDivElement>(null);

  // Fetch data on component mount
=======
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const previewContentRef = useRef<HTMLDivElement>(null);
  const [devisId, setDevisId] = useState<string>("");
  // Fetch clients on component mount
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchRegions());
    dispatch(fetchClients());
    dispatch(fetchDevis());
    setQuoteNumber(`DEV${Date.now().toString().slice(-6)}`);
  }, [dispatch]);

  // Calculate duration
  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate);
      setDuration(days > 0 ? days : 0);
    } else {
      setDuration(0);
    }
  }, [startDate, endDate]);

<<<<<<< HEAD
  // Calculate base price
  useEffect(() => {
    let calculatedBasePrice = 0;
    const region = regions.find((r) => r.id === Number(selectedDestination));
    if (region && duration > 0) {
      calculatedBasePrice += region.prix.prix * duration;
    }
    setBasePrice(calculatedBasePrice);
  }, [duration, selectedDestination, regions]);

  // Calculate final total price
=======
  // fetch pour le vehicule
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/vehicles");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const available = data.filter(
          (vehicle: Vehicle) => vehicle.status.status === "Disponible"
        );
        setAvailableVehicles(available);
      } catch (error: any) {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          `Erreur lors du chargement des véhicules: ${error.message}`
        );
        setOpenSnackbar(true);
      }
    };
    fetchVehicles();
  }, []);

  // *** NOUVEL EFFECT POUR LE CHARGEMENT DES RÉGIONS
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
  useEffect(() => {
    const fetchRegions = async () => {
      setLoadingRegions(true);
      setRegionsError(null);
      try {
        const response = await fetch("http://localhost:3000/regions");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Region[] = await response.json();
        setRegions(data);
      } catch (error: any) {
        console.error("Erreur lors du chargement des régions:", error);
        setRegionsError(
          `Erreur lors du chargement des régions: ${error.message}`
        );
        setSnackbarSeverity("error");
        setSnackbarMessage(
          `Erreur lors du chargement des régions: ${error.message}`
        );
        setOpenSnackbar(true);
      } finally {
        setLoadingRegions(false);
      }
    };
    fetchRegions();
  }, []);

  // Effect to calculate base price (unchanged)
  const calculateNumberOfDays = (
    startDateString: string,
    endDateString: string
  ): number => {
    const start = new Date(startDateString);
    const end = new Date(endDateString);

    // Check if dates are valid. If not, return 0 or throw an error.
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn(
        "Invalid date string provided to calculateNumberOfDays:",
        startDateString,
        endDateString
      );
      return 0; // Or handle as an error
    }

    // Set to UTC midnight to ensure consistent day calculation regardless of timezone
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    // Calculate difference in milliseconds
    const diffTime = Math.abs(end.getTime() - start.getTime());
    // Convert milliseconds to days and round up, then add 1 to include both start and end day
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Add a state variable for devisId if you want to fetch a specific devis (quote) by ID

  // Effect hook to fetch devis details from the backend
  useEffect(() => {
    const fetchDevisDetails = async () => {
      // Validate devisId before making the API call
      if (!devisId) {
        setError("Devis ID is missing. Cannot fetch details.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Set loading state to true
        setError(""); // Clear any previous errors

        const response = await axios.get<DevisData>(
          `http://localhost:3000/devis/${devisId}`
        );
        const devisData: DevisData = response.data; // Type assertion here

        const calculatedBasePrice: number =
          devisData.items.reduce((acc: number, item: DevisItem) => {
            const unitPrice =
              typeof item.unitPrice === "number" ? item.unitPrice : 0;
            const quantity =
              typeof item.quantity === "number" ? item.quantity : 0;
            return acc + unitPrice * quantity;
          }, 0) * calculateNumberOfDays(devisData.startDate, devisData.endDate);

        const calculatedEstimatedFuelPrice: number =
          devisData.includesFuel && typeof devisData.fuelCostPerDay === "number"
            ? devisData.fuelCostPerDay *
              calculateNumberOfDays(devisData.startDate, devisData.endDate)
            : 0;

        const calculatedFinalTotalPrice: number =
          typeof devisData.totalAmount === "number" ? devisData.totalAmount : 0;

        setBasePrice(calculatedBasePrice);
        setEstimatedFuelPrice(calculatedEstimatedFuelPrice);
        setFinalTotalPrice(calculatedFinalTotalPrice);
        setWithFuel(devisData.includesFuel);
      } catch (err: any) {
        console.error("Error fetching devis details:", err);

        if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 404
        ) {
          setError("Devis not found.");
        } else if (axios.isAxiosError(err) && err.message) {
          setError(
            `Network error: ${err.message}. Please check your backend server.`
          );
        } else {
          setError("Failed to load devis details. Please try again later.");
        }
        // Ensure prices are reset to 0 on error to prevent NaN in display
        setBasePrice(0);
        setEstimatedFuelPrice(0);
        setFinalTotalPrice(0);
        setWithFuel(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDevisDetails();
  }, [devisId]);

  // Load external scripts
  useEffect(() => {
    const loadScript = (src: string, id: string, onload: () => void) => {
      if (document.getElementById(id)) {
        onload();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.id = id;
      script.onload = onload;
      document.body.appendChild(script);
    };
    let html2canvasLoaded = false;
    let jspdfLoaded = false;
    const checkAllLoaded = () => {
      if (html2canvasLoaded && jspdfLoaded) {
        console.log("html2canvas and jspdf loaded.");
      }
    };
<<<<<<< HEAD
    loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
      'html2canvas-script',
=======

    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      "html2canvas-script",
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
      () => {
        html2canvasLoaded = true;
        checkAllLoaded();
      }
    );
    loadScript(
<<<<<<< HEAD
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
      'jspdf-script',
=======
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      "jspdf-script",
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
      () => {
        jspdfLoaded = true;
        checkAllLoaded();
      }
    );
  }, []);

  // Handler for saving a new client
  const handleSaveClient = async () => {
<<<<<<< HEAD
    if (!newClient.lastName || !newClient.email || !newClient.phone) {
      setSnackbarMessage('Veuillez remplir tous les champs du client.');
      setSnackbarSeverity('warning');
=======
    if (!newClient.name || !newClient.email || !newClient.phone) {
      setSnackbarMessage("Veuillez remplir tous les champs du client.");
      setSnackbarSeverity("warning");
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
      setOpenSnackbar(true);
      return;
    }
    try {
      const resultAction = await dispatch(
        addClient({
<<<<<<< HEAD
          lastName: newClient.lastName,
          email: newClient.email,
          phone: newClient.phone,
          logo: '',
        })
      );
      if (addClient.fulfilled.match(resultAction)) {
        setSelectedClientId(resultAction.payload.id.toString());
        setOpenClientDialog(false);
        setNewClient({ id: '', lastName: '', email: '', phone: '' });
        setSnackbarMessage('Client ajouté avec succès !');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(
          resultAction.payload as string || "Erreur lors de l'enregistrement du client."
        );
        setSnackbarSeverity('error');
=======
          lastName: newClient.name,
          email: newClient.email,
          phone: newClient.phone,
          logo: "",
        })
      );

      if (addClient.fulfilled.match(resultAction)) {
        setSelectedClientId(resultAction.payload.id.toString());
        setOpenClientDialog(false);
        setNewClient({ id: "", name: "", email: "", phone: "" });
        setSnackbarMessage("Client ajouté avec succès !");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(
          (resultAction.payload as string) ||
            "Erreur lors de l'enregistrement du client."
        );
        setSnackbarSeverity("error");
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Erreur lors de l'enregistrement du client.");
<<<<<<< HEAD
      setSnackbarSeverity('error');
=======
      setSnackbarSeverity("error");
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
      setOpenSnackbar(true);
    }
  };

  // Handler for form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
<<<<<<< HEAD
    if (
      !selectedClientId ||
      !startDate ||
      !endDate ||
      !selectedVehicle ||
      !selectedDestination ||
      !expirationDate
    ) {
      setSnackbarMessage('Veuillez remplir tous les champs obligatoires.');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
    console.log("----------------------------------------");
    console.log(selectedClientId, Number(selectedClientId));
    console.log(selectedVehicle, Number(selectedVehicle));
    console.log(selectedDestination, Number(selectedDestination));
    console.log(startDate, format(startDate, 'yyyy-MM-dd'));
    console.log(endDate, format(endDate, 'yyyy-MM-dd'));
    

    const devisData: CreateDevisDto = {
      clientId: Number(selectedClientId),
      items: [
        {
          quantity: 1,
          regionId: Number(selectedDestination),
          vehiculeId: Number(selectedVehicle),
        },
      ],
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      includesFuel: withFuel,
      fuelCostPerDay: withFuel ? estimatedFuelPrice / duration : undefined,
    };
    console.log("Final devisData payload: ", devisData);

    try {
      const resultAction = await dispatch(createDevis(devisData));
      if (createDevis.fulfilled.match(resultAction)) {
        setSnackbarMessage('Devis créé avec succès !');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setSelectedClientId('');
        setStartDate(null);
        setEndDate(null);
        setSelectedVehicle('');
        setSelectedDestination('');
        setWithFuel(false);
        setEstimatedFuelPrice(0);
        setQuoteNumber(`DEV${Date.now().toString().slice(-6)}`);
      } else {
        setSnackbarMessage(
          resultAction.payload as string || 'Erreur lors de la création du devis.'
        );
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Erreur lors de la création du devis.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
=======
    const selectedClient = clients.find(
      (c) => c.id === Number(selectedClientId)
    );
    console.log({
      quoteNumber,
      client: selectedClient || {
        id: "",
        name: "N/A",
        email: "N/A",
        phone: "N/A",
        address: "N/A",
      },
      quoteDate: quoteDate
        ? format(quoteDate, "dd/MM/yyyy", { locale: fr })
        : "",
      expirationDate: expirationDate
        ? format(expirationDate, "dd/MM/yyyy", { locale: fr })
        : "",
      startDate: startDate
        ? format(startDate, "dd/MM/yyyy", { locale: fr })
        : "",
      endDate: endDate ? format(endDate, "dd/MM/yyyy", { locale: fr }) : "",
      duration,
      selectedVehicle: availableVehicles.find((v) => v.id === selectedVehicle)
        ?.nom,
      selectedRegionId: regions.find((d) => d.id === selectedRegionId)
        ?.nom_region,
      basePrice,
      withFuel,
      estimatedFuelPrice: withFuel ? estimatedFuelPrice : 0,
      finalTotalPrice,
    });
    setSnackbarMessage("Devis généré avec succès !");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
  };

  // --- MODIFIED: handleCreateAndPrint to create Devis on backend ---
  const handleCreateAndPrint = async () => {
    if (
      !selectedClientId ||
      !startDate ||
      !endDate ||
      !selectedVehicle ||
      !selectedDestination ||
      !expirationDate
    ) {
      setSnackbarMessage(
<<<<<<< HEAD
        'Veuillez remplir tous les champs obligatoires, y compris la sélection du client et la date d\'expiration, avant de créer et d\'imprimer le devis.'
      );
      setSnackbarSeverity('warning');
=======
        "Veuillez remplir tous les champs obligatoires, y compris la sélection du client et la date d'expiration, avant de créer et d'imprimer le devis."
      );
      setSnackbarSeverity("warning");
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
      setOpenSnackbar(true);
      return;
    }

    setLoading(true); // Start local loading for the API call
    setSnackbarMessage("Création du devis et préparation à l'impression...");
    setSnackbarSeverity("info");
    setOpenSnackbar(true);

    try {
      // Prepare the data for the backend
      const devisDataToSend: CreateDevisDto = {
        clientId: selectedClientId,
        startDate: startDate.toISOString(), // Convert Date object to ISO string
        endDate: endDate.toISOString(), // Convert Date object to ISO string
        includesFuel: withFuel,
        // Only include fuelCostPerDay if withFuel is true and it's a valid number
        ...(withFuel &&
          estimatedFuelPrice > 0 && { fuelCostPerDay: estimatedFuelPrice }),
        items: [
          {
            regionId: Number(selectedRegionId), // Ensure it's a number
            vehiculeId: Number(selectedVehicle), // Ensure it's a number
            quantity: 1, // Assuming one vehicle per devis item for simplicity
          },
        ],
        // Add other fields if your CreateDevisDto requires them
        // quoteDate: quoteDate?.toISOString(),
        // expirationDate: expirationDate?.toISOString(),
      };

      // Make the POST request to create the devis
      const response = await axios.post<DevisData>(
        `http://localhost:3000/devis`,
        devisDataToSend
      );
      const createdDevis = response.data;

      // Set the devisId from the newly created devis.
      // This will trigger the useEffect to fetch and display its details.
      setDevisId(createdDevis.id);

      setSnackbarMessage("Devis créé avec succès ! Prévisualisation...");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setShowPreview(true);
      // Give a small delay for the DevisDisplay component to fetch and render
      setTimeout(() => {
        generatePdf();
        handleClosePreview();
      }, 1500); // Increased delay to allow data fetching and rendering
    } catch (error: any) {
      console.error(
        "Erreur lors de la création du devis:",
        error.response ? error.response.data : error.message
      );
      setSnackbarMessage(
        `Erreur lors de la création du devis: ${
          error.response?.data?.message || error.message
        }`
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false); // End local loading
    }
  };
  const handlePrint = () => {
    handlePreview();
    setTimeout(() => {
      generatePdf();
      handleClosePreview();
    }, 500);
  };

  const handleConfirm = () => {
<<<<<<< HEAD
    setSnackbarMessage('Fonctionnalité Confirmer en cours de développement.');
    setSnackbarSeverity('info');
=======
    console.log("Fonctionnalité Confirmer en cours de développement.");
    setSnackbarMessage("Fonctionnalité Confirmer en cours de développement.");
    setSnackbarSeverity("info");
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
    setOpenSnackbar(true);
  };

  const handlePreview = () => {
    if (
      !selectedClientId ||
      !startDate ||
      !endDate ||
      !selectedVehicle ||
      !selectedDestination ||
      !expirationDate
    ) {
      setSnackbarMessage(
<<<<<<< HEAD
        'Veuillez remplir tous les champs obligatoires, y compris la sélection du client et la date d\'expiration, avant de prévisualiser le devis.'
      );
      setSnackbarSeverity('warning');
=======
        "Veuillez remplir tous les champs obligatoires, y compris la sélection du client et la date d'expiration, avant de prévisualiser le devis."
      );
      setSnackbarSeverity("warning");
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
      setOpenSnackbar(true);
      return;
    }
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleOpenClientDialog = () => {
    setOpenClientDialog(true);
  };

  const handleCloseClientDialog = () => {
    setOpenClientDialog(false);
<<<<<<< HEAD
    setNewClient({ id: '', lastName: '', email: '', phone: '' });
=======
    setNewClient({ id: "", name: "", email: "", phone: "" });
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
  };

  const handleCancel = () => {
    console.log("Fonctionnalité Annuler en cours de développement.");
    setSelectedClientId("");
    setQuoteDate(new Date());
    setExpirationDate(addDays(new Date(), 30));
    setStartDate(null);
    setEndDate(null);
    setDuration(0);
    setSelectedVehicle("");
    setSelectedRegionId("");
    setEstimatedFuelPrice(0);
    setWithFuel(false);
<<<<<<< HEAD
    setQuoteNumber(`DEV${Date.now().toString().slice(-6)}`);
    setSnackbarMessage('Formulaire annulé et réinitialisé.');
    setSnackbarSeverity('info');
=======
    setDevisId("");
    setQuoteNumber(`DEV-${Date.now().toString().slice(-6)}`);
    setSnackbarMessage("Formulaire annulé et réinitialisé.");
    setSnackbarSeverity("info");
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const generatePdf = async () => {
    if (!window.html2canvas || !window.jspdf) {
      setSnackbarMessage(
        "Les bibliothèques de PDF ne sont pas encore chargées. Veuillez réessayer."
      );
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    if (!previewContentRef.current) {
      setSnackbarMessage(
        "Contenu de prévisualisation introuvable pour la génération de PDF."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
<<<<<<< HEAD
    setSnackbarMessage('Génération du PDF en cours...');
    setSnackbarSeverity('info');
=======

    setSnackbarMessage("Génération du PDF en cours...");
    setSnackbarSeverity("info");
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
    setOpenSnackbar(true);
    const dialogContent = previewContentRef.current;
    const originalStyles = {
      height: dialogContent.style.height,
      overflow: dialogContent.style.overflow,
      maxHeight: dialogContent.style.maxHeight,
      position: dialogContent.style.position,
    };
    try {
<<<<<<< HEAD
      dialogContent.style.height = 'auto';
      dialogContent.style.overflow = 'visible';
      dialogContent.style.maxHeight = 'none';
      dialogContent.style.position = 'relative';
=======
      dialogContent.style.height = "auto";
      dialogContent.style.overflow = "visible";
      dialogContent.style.maxHeight = "none";
      dialogContent.style.position = "relative";

>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
      const canvas = await window.html2canvas(dialogContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: dialogContent.scrollWidth,
        windowHeight: dialogContent.scrollHeight,
      });
      for (const prop in originalStyles) {
<<<<<<< HEAD
        dialogContent.style[prop as keyof typeof originalStyles] =
          originalStyles[prop as keyof typeof originalStyles];
      }
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
=======
        dialogContent.style[prop as any] =
          originalStyles[prop as keyof typeof originalStyles];
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new window.jspdf.jsPDF("p", "mm", "a4");

>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
<<<<<<< HEAD
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
=======

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
<<<<<<< HEAD
      const selectedClient = clients.find((c) => c.id === Number(selectedClientId));
      const clientNameForFile = selectedClient
        ? selectedClient.lastName.replace(/\s/g, '_')
        : 'client';
=======

      const selectedClient = clients.find(
        (c) => c.id === Number(selectedClientId)
      );
      const clientNameForFile = selectedClient
        ? selectedClient.lastName.replace(/\s/g, "_")
        : "client";
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
      pdf.save(`Devis_${clientNameForFile}_${quoteNumber}.pdf`);
      setSnackbarMessage("PDF généré avec succès !");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      setSnackbarMessage(
        "Erreur lors de la génération du PDF. Veuillez réessayer."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      for (const prop in originalStyles) {
<<<<<<< HEAD
        dialogContent.style[prop as keyof typeof originalStyles] =
=======
        dialogContent.style[prop as any] =
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
          originalStyles[prop as keyof typeof originalStyles];
      }
    }
  };

<<<<<<< HEAD
=======
  const getVehicleName = (id: string) =>
    availableVehicles.find((v) => v.id === id)?.nom || "N/A";
  const getDestinationName = (id: string) =>
    regions.find((d) => d.id === id)?.nom_region || "N/A";
  const getDestinationUnitPrice = (id: string) => {
    const prix = regions.find((d) => d.id === id)?.prix;
    return typeof prix === "number" ? prix : Number(prix) || 0;
  };

  const getClient = (id: string) => {
    console.log(`getClient: Searching for ID='${id}' (type: ${typeof id})`);
    const foundClient = clients.find((c) => {
      return c.id === Number(id);
    });

    if (foundClient) {
      return foundClient;
    } else {
      console.log("getClient: Client not found, returning default.");
      // Objet par défaut (assurez-vous qu'il correspond à la structure attendue, notamment lastName)
      return {
        id: "",
        lastName: "N/A",
        email: "N/A",
        phone: "N/A",
        address: "N/A",
      };
      // Si votre type Customer a plus de champs obligatoires, ajoutez-les ici avec des valeurs par défaut
    }
  };

  if (loading) {
    return (
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "center", p: 2 }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid item xs={12} sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Grid>
    );
  }

>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: theme.palette.background.default,
<<<<<<< HEAD
            minHeight: '100vh',
          }}
        >
          {clientsLoading && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.info.main }}>
              Chargement des clients...
            </Typography>
          )}
          {clientsError && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.error.main }}>
              Erreur: {clientsError}
            </Typography>
          )}
          {vehiclesLoading && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.info.main }}>
              Chargement des véhicules...
            </Typography>
          )}
          {vehiclesError && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.error.main }}>
              Erreur: {vehiclesError}
            </Typography>
          )}
          {regionsStatus === 'loading' && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.info.main }}>
              Chargement des régions...
            </Typography>
          )}
          {regionsError && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.error.main }}>
              Erreur: {regionsError}
            </Typography>
          )}
          {devisLoading && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.info.main }}>
              Chargement des devis...
            </Typography>
          )}
          {devisError && (
            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.error.main }}>
              Erreur: {devisError}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 4, flexWrap: 'wrap' }}>
=======
            minHeight: "100vh",
          }}
        >
          {loading && (
            <Typography
              variant="body1"
              sx={{ mb: 2, color: theme.palette.info.main }}
            >
              Chargement des clients...
            </Typography>
          )}
          {error && (
            <Typography
              variant="body1"
              sx={{ mb: 2, color: theme.palette.error.main }}
            >
              Erreur: {error}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gap: 2,
              mb: 4,
              flexWrap: "wrap",
            }}
          >
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
            <Button variant="outlined" color="info" onClick={handlePreview}>
              Aperçu
            </Button>
            <Button variant="contained" color="success" onClick={handleConfirm}>
              Confirmer
            </Button>
            <Button variant="contained" color="primary" onClick={handlePrint}>
              Imprimer
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Annuler
            </Button>
          </Box>
<<<<<<< HEAD
          <Paper
            elevation={6}
            sx={{ p: 5, maxWidth: 900, margin: 'auto', borderRadius: '12px' }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  N° Devis:{' '}
=======

          <Paper
            elevation={6}
            sx={{ p: 5, maxWidth: 900, margin: "auto", borderRadius: "12px" }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  N° Devis:{" "}
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                  <strong style={{ color: theme.palette.primary.main }}>
                    {quoteNumber}
                  </strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h4"
                  gutterBottom
                  align="right"
<<<<<<< HEAD
                  sx={{ color: theme.palette.primary.main }}
=======
                  sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                >
                  Devis de location de véhicule
                </Typography>
              </Grid>
            </Grid>
<<<<<<< HEAD
=======

>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={{ mb: 4, color: theme.palette.primary.dark }}
            >
              Détails du Devis
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required
                    variant="outlined"
<<<<<<< HEAD
                    disabled={clientsLoading}
                  >
                    <InputLabel id="client-select-label">Sélectionnez un client</InputLabel>
=======
                    disabled={loading}
                  >
                    <InputLabel id="client-select-label">
                      Sélectionnez un client
                    </InputLabel>
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                    <Select
                      labelId="client-select-label"
                      value={selectedClientId}
                      label="Sélectionnez un client"
                      onChange={(e) =>
                        setSelectedClientId(e.target.value as string)
                      }
                    >
                      <MenuItem value="">
                        <em>Sélectionner un client</em>
                      </MenuItem>
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.lastName}
                        </MenuItem>
                      ))}
                      <MenuItem value="new">Créer un nouveau client</MenuItem>
                    </Select>
                  </FormControl>
                  {selectedClientId === "new" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenClientDialog}
                      sx={{ mt: 2 }}
                    >
                      Ajouter un nouveau client
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date du devis"
                    value={quoteDate}
                    onChange={(newValue) =>
                      setQuoteDate(newValue ? new Date(newValue as any) : null)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        InputProps: { readOnly: true },
                        variant: "outlined",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date d'expiration du devis"
                    value={expirationDate}
                    onChange={(newValue) =>
<<<<<<< HEAD
                      setExpirationDate(newValue ? new Date(newValue as any) : null)
=======
                      setExpirationDate(
                        newValue ? new Date(newValue as any) : null
                      )
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                    }
                    minDate={quoteDate || new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: "outlined",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de début de location"
                    value={startDate}
                    onChange={(newValue) =>
                      setStartDate(newValue ? new Date(newValue as any) : null)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: "outlined",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de fin de location"
                    value={endDate}
                    onChange={(newValue) =>
                      setEndDate(newValue ? new Date(newValue as any) : null)
                    }
                    minDate={startDate || undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: "outlined",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Durée (Jours)"
                    value={duration}
                    InputProps={{ readOnly: true }}
                    variant="filled"
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel id="vehicle-select-label">
                      Sélectionnez un véhicule
                    </InputLabel>
                    <Select
                      labelId="vehicle-select-label"
                      value={selectedVehicle}
                      label="Sélectionnez un véhicule"
                      onChange={(e) =>
                        setSelectedVehicle(e.target.value as string)
                      }
                    >
<<<<<<< HEAD
                      <MenuItem value="">
                        <em>Sélectionner un véhicule</em>
                      </MenuItem>
                      {vehicles.map((vehicle) => (
                        <MenuItem key={vehicle.id} value={vehicle.id.toString()}>
                          {`${vehicle.nom} (${vehicle.marque} ${vehicle.modele})`}
=======
                      {/* Map only over the filtered available vehicles */}
                      {availableVehicles.map((vehicle) => (
                        <MenuItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.nom} ({vehicle.marque} -{" "}
                          {vehicle.immatriculation})
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
<<<<<<< HEAD
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel id="destination-select-label">
                      Sélectionnez une destination
=======
                  <FormControl
                    fullWidth
                    required
                    variant="outlined"
                    disabled={loadingRegions}
                  >
                    <InputLabel id="region-select-label">
                      Sélectionnez une région
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                    </InputLabel>
                    <Select
                      labelId="region-select-label"
                      value={selectedRegionId}
                      label="Sélectionnez une région"
                      onChange={(e) =>
                        setSelectedRegionId(e.target.value as string)
                      }
                    >
<<<<<<< HEAD
                      <MenuItem value="">
                        <em>Sélectionner une destination</em>
                      </MenuItem>
                      {regions.map((region) => (
                        <MenuItem key={region.id} value={region.id.toString()}>
                          {region.nom_region} ({region.prix.prix} Ar)
                        </MenuItem>
                      ))}
=======
                      {loadingRegions ? (
                        <MenuItem disabled>Chargement des régions...</MenuItem>
                      ) : regionsError ? (
                        <MenuItem disabled>Erreur: {regionsError}</MenuItem>
                      ) : regions.length === 0 ? (
                        <MenuItem disabled>Aucune région disponible</MenuItem>
                      ) : (
                        regions.map((region) => (
                          <MenuItem key={region.id} value={region.id}>
                            {region.nom_region} ({region.nom_district}) -{" "}
                            {Number(region.prix.prix)} Ar
                          </MenuItem>
                        ))
                      )}
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                    </Select>
                  </FormControl>
                  {regionsError && (
                    <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                      {regionsError}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Option Carburant</FormLabel>
                    <RadioGroup
                      row
                      aria-label="withFuel"
                      name="row-radio-buttons-group"
                      value={withFuel ? "yes" : "no"}
                      onChange={(e) => {
                        setWithFuel(e.target.value === "yes");
                        if (e.target.value === "no") {
                          setEstimatedFuelPrice(0);
                        }
                      }}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Avec Carburant"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="Sans Carburant"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {withFuel && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Prix estimatif du carburant ($)"
                      type="number"
                      value={estimatedFuelPrice === 0 ? "" : estimatedFuelPrice}
                      onChange={(e) =>
                        setEstimatedFuelPrice(Number(e.target.value))
                      }
                      inputProps={{ min: 0 }}
                      variant="outlined"
                      required={withFuel}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
<<<<<<< HEAD
                  <Typography
                    variant="h6"
                    align="right"
                    sx={{ mt: 1, mb: 1, color: 'text.secondary' }}
=======
                  {/* Display Base Price */}
                  <Typography
                    variant="h6"
                    align="right"
                    sx={{ mt: 1, mb: 1, color: "text.secondary" }}
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                  >
                    Prix de base: {basePrice.toFixed(2)} Ar
                  </Typography>

                  {/* Conditionally display Estimated Fuel Price if 'withFuel' is true */}
                  {withFuel && (
                    <Typography
                      variant="h6"
                      align="right"
<<<<<<< HEAD
                      sx={{ mb: 1, color: 'text.secondary' }}
=======
                      sx={{ mb: 1, color: "text.secondary" }}
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                    >
                      Carburant estimatif: {estimatedFuelPrice.toFixed(2)} Ar
                    </Typography>
                  )}
<<<<<<< HEAD
=======

                  {/* Display Final Total Price */}
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                  <Typography
                    variant="h5"
                    align="right"
                    sx={{
                      mt: 3,
                      mb: 2,
<<<<<<< HEAD
                      fontWeight: 'bold',
                      color: theme.palette.secondary.main,
                    }}
                  >
                    Prix total final:{' '}
                    <span style={{ fontSize: '1.8rem', color: theme.palette.success.main }}>
=======
                      fontWeight: "bold",
                      color: theme.palette.secondary.main,
                    }}
                  >
                    Prix total final:{" "}
                    <span
                      style={{
                        fontSize: "1.8rem",
                        color: theme.palette.success.main,
                      }}
                    >
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                      {finalTotalPrice.toFixed(2)} Ar
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ py: 1.5, fontSize: "1.1rem", borderRadius: "8px" }}
                  >
                    Créer
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          {/* New Client Dialog */}
          <Dialog
            open={openClientDialog}
            onClose={handleCloseClientDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
              >
                <TextField
                  fullWidth
                  label="Nom du client"
<<<<<<< HEAD
                  value={newClient.lastName}
                  onChange={(e) =>
                    setNewClient({ ...newClient, lastName: e.target.value })
=======
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, name: e.target.value })
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
                  }
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Numéro de téléphone"
                  value={newClient.phone}
                  onChange={(e) =>
                    setNewClient({ ...newClient, phone: e.target.value })
                  }
                  required
                  variant="outlined"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseClientDialog}
                color="primary"
                variant="outlined"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveClient}
                color="success"
                variant="contained"
              >
                Enregistrer
              </Button>
            </DialogActions>
          </Dialog>
<<<<<<< HEAD
          {/* Quote Preview Dialog */}
          <QuotePreviewDialog
            open={showPreview}
            onClose={handleClosePreview}
            onGeneratePdf={generatePdf}
            quoteNumber={quoteNumber}
            quoteDate={quoteDate}
            expirationDate={expirationDate}
            startDate={startDate}
            duration={duration}
            selectedVehicle={selectedVehicle}
            selectedDestination={selectedDestination}
            basePrice={basePrice}
            withFuel={withFuel}
            estimatedFuelPrice={estimatedFuelPrice}
            selectedClientId={selectedClientId}
            clients={clients.map((c) => ({
              ...c,
              id: c.id.toString(),
            }))}
            vehicles={vehicles}
            regions={regions.map(region => ({
              id: region.id,
              name: region.nom_region,
              price: region.prix.prix
            }))}
            dialogContentRef={previewContentRef}
          />
=======

          {/* Preview Dialog */}
          <Dialog
            open={showPreview}
            onClose={handleClosePreview}
            maxWidth="md"
            fullWidth
          >
            <DialogContent
              ref={previewContentRef}
              sx={{ p: 0, backgroundColor: "#fff", position: "relative" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  p: 3,
                  pb: 1,
                  borderBottom: "1px solid #eee",
                  backgroundColor: "#fff",
                }}
              >
                <Box>
                  <img
                    src="/src/assets/horizontal.png"
                    alt="Mirent Logo"
                    style={{ maxWidth: "300px", objectFit: "contain" }}
                  />
                </Box>
                <Box
                  sx={{
                    border: "1px solid blue",
                    borderRadius: "10px",
                    minWidth: "300px",
                    minHeight: "150px",
                    backgroundColor: "#f0f0f0",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecoration: "underline",
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    Client:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: "#333" }}>
                    Nom: {getClient(selectedClientId).lastName}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: "#333" }}>
                    Email: {getClient(selectedClientId).email}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: "#333" }}>
                    Téléphone: {getClient(selectedClientId).phone}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 3, pt: 2, pb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                  }}
                >
                  {quoteNumber}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#333" }}>
                  <Typography component="span" fontWeight="bold">
                    Date du devis:
                  </Typography>{" "}
                  {quoteDate
                    ? format(quoteDate, "dd MMMM yyyy", { locale: fr })
                    : "Non spécifiée"}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#333" }}>
                  <Typography component="span" fontWeight="bold">
                    Date d'expiration:
                  </Typography>{" "}
                  {expirationDate
                    ? format(expirationDate, "dd MMMM yyyy", { locale: fr })
                    : "Non spécifiée"}
                </Typography>
              </Box>

              <Box sx={{ p: 3, pt: 1 }}>
                <Grid
                  container
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  <Grid
                    item
                    xs={1}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      p: 1,
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Réf.
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      p: 1,
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Voiture
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      p: 1,
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Destination
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      p: 1,
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Prix Unitaire
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      p: 1,
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Date
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      p: 1,
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Jour
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      p: 1,
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Carburant
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ backgroundColor: "#f0f0f0", p: 1 }}>
                    <Typography variant="body2" fontWeight="bold" align="right">
                      Prix total
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={1}
                    sx={{
                      p: 1,
                      borderRight: "1px solid #eee",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2">1</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      p: 1,
                      borderRight: "1px solid #eee",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2">
                      {getVehicleName(selectedVehicle)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      p: 1,
                      borderRight: "1px solid #eee",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2">
                      {getDestinationName(selectedDestination)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sx={{
                      p: 1,
                      borderRight: "1px solid #eee",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2">
                      {getDestinationUnitPrice(selectedDestination).toFixed(2)}{" "}
                      Ar
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      p: 1,
                      borderRight: "1px solid #eee",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2">
                      {startDate
                        ? format(startDate, "dd/MM/yyyy", { locale: fr })
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sx={{
                      p: 1,
                      borderRight: "1px solid #eee",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2">{duration}</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sx={{
                      p: 1,
                      borderRight: "1px solid #eee",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <Typography variant="body2">
                      {withFuel ? "Oui" : "Non"}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ p: 1, borderTop: "1px solid #ddd" }}>
                    <Typography variant="body2" align="right">
                      {basePrice.toFixed(2)} Ar
                    </Typography>
                  </Grid>

                  {withFuel && (
                    <>
                      <Grid
                        item
                        xs={10}
                        sx={{
                          p: 1,
                          borderRight: "1px solid #eee",
                          borderTop: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          Prix estimatif du carburant:
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{ p: 1, borderTop: "1px solid #ddd" }}
                      >
                        <Typography variant="body2" align="right">
                          {estimatedFuelPrice.toFixed(2)} Ar
                        </Typography>
                      </Grid>
                    </>
                  )}

                  <Grid
                    item
                    xs={10}
                    sx={{
                      p: 1,
                      borderRight: "1px solid #eee",
                      borderTop: "1px solid #ddd",
                      backgroundColor: "#f9f9f9",
                      textAlign: "right",
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      TOTAL
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      p: 1,
                      borderTop: "1px solid #ddd",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold" align="right">
                      {finalTotalPrice.toFixed(2)} Ar
                    </Typography>
                  </Grid>
                </Grid>

                <Typography
                  variant="body1"
                  sx={{ mt: 2, fontStyle: "italic", color: "#555" }}
                >
                  Arrêtée la présente facture proforma à la somme de: "QUATRES
                  CENT MILLE ARIARY ".
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 3,
                  pt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  pl: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ ml: "auto" }}>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", color: "#555" }}
                  >
                    Antananarivo, le{" "}
                    {format(new Date(), "dd MMMM yyyy", { locale: fr })}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", color: "#555", mt: 1 }}
                  >
                    Pour Mirent,
                  </Typography>
                  <img
                    src="/src/assets/signature.png"
                    alt="Mirent Signature"
                    style={{ minWidth: "200px", objectFit: "contain" }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  p: 3,
                  pt: 2,
                  borderTop: "1px solid #eee",
                  backgroundColor: "#f8f8f8",
                  textAlign: "center",
                  mt: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "#555" }}
                >
                  Mail: mirent.mdg@gmail.com
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "#555" }}
                >
                  Tel: +261 38 13 690 04
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "#555", mt: 1 }}
                >
                  Lot II P 136 Ter Avaradoha Antananarivo 101
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "#555" }}
                >
                  NIF: 7018487985 Stat: 49295 11 024 0 10341
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "#555" }}
                >
                  RIB: 00015 00008 0386310000 1 37
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                justifyContent: "center",
              }}
            >
              <Button
                onClick={handleClosePreview}
                color="primary"
                variant="outlined"
              >
                Fermer
              </Button>
              <Button
                onClick={handleCreateAndPrint}
                color="success"
                variant="contained"
              >
                Créer et Imprimer
              </Button>
            </DialogActions>
          </Dialog>

>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
<<<<<<< HEAD
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
=======
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
<<<<<<< HEAD
              sx={{ width: '100%' }}
=======
              sx={{ width: "100%" }}
>>>>>>> 378d007bef06e0058bbf44b29cc863d4e0638763
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default QuoteForm;
