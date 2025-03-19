import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  Grid,
  CircularProgress,
  FormHelperText,
  Typography,
  SelectChangeEvent,
} from "@mui/material";

import {
  createVehicle,
  fetchVehicles,
  Vehicle,
} from "../../redux/features/vehicle/vehiclesSlice";

import { useAppDispatch } from "../../hooks";
import { toast } from "react-toastify";
import {
  AiOutlineCar,
  AiOutlineTag,
  AiOutlineNumber,
  AiOutlineClose,
} from "react-icons/ai";
import { CameraAltOutlined } from "@mui/icons-material";

interface AddVehicleProps {
  open: boolean;
  onClose: () => void;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const [vehicle, setVehicle] = useState<Vehicle>({
    id: 0,
    nom: "",
    marque: "",
    modele: "",
    immatriculation: "",
    nombrePlace: 0,
    type: { id: 0, type: "" },
    status: { id: 0, status: "" },
    imageUrl: "",
  });

  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [vehicleStatuses, setVehicleStatuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      setIsLoading(true);

      try {
        const [typesResponse, statusesResponse] = await Promise.all([
          fetch("http://localhost:3000/type"),
          fetch("http://localhost:3000/status"),
        ]);

        const [typesData, statusesData] = await Promise.all([
          typesResponse.json(),
          statusesResponse.json(),
        ]);

        setVehicleTypes(typesData);
        setVehicleStatuses(statusesData);

        if (typesData.length > 0 && vehicle.type.type === "") {
          setVehicle((prev) => ({
            ...prev,
            type: { id: typesData[0].id, type: typesData[0].type },
          }));
        }

        if (statusesData.length > 0 && vehicle.status.status === "") {
          setVehicle((prev) => ({
            ...prev,
            status: { id: statusesData[0].id, status: statusesData[0].status },
          }));
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        toast.error(
          "Une erreur s'est produite lors du chargement des données."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setVehicle((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
    } else {
      setImageFile(null);
      setVehicle((prev) => ({
        ...prev,
        imageUrl: "",
      }));
    }
  };

  const handleSelectType = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (!value) return;

    const selectedType = vehicleTypes.find((type) => type.type === value);
    if (selectedType) {
      setVehicle((prev) => {
        return {
          ...prev,
          type: { id: selectedType.id, type: selectedType.type },
        };
      });
    }
  };

  const handleSelectStatus = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (!value) return;

    const selectedStatus = vehicleStatuses.find(
      (status) => status.status === value
    );
    if (selectedStatus) {
      setVehicle((prev) => {
        return {
          ...prev,
          status: { id: selectedStatus.id, status: selectedStatus.status },
        };
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!vehicle.nom) newErrors.nom = "Le nom est requis.";
    if (!vehicle.marque) newErrors.marque = "La marque est requise.";
    if (!vehicle.modele) newErrors.modele = "Le modèle est requis.";
    if (!vehicle.immatriculation)
      newErrors.immatriculation = "L'immatriculation est requise.";
    if (vehicle.nombrePlace <= 0)
      newErrors.nombrePlace = "Le nombre de places doit être supérieur à 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("nom", vehicle.nom);
      formData.append("marque", vehicle.marque);
      formData.append("modele", vehicle.modele);
      formData.append("immatriculation", vehicle.immatriculation);
      formData.append("nombrePlace", vehicle.nombrePlace.toString());
      formData.append("typeId", vehicle.type.id.toString());
      formData.append("statusId", vehicle.status.id.toString());

      if (imageFile) {
        formData.append("image", imageFile);
        console.log("Type de imageFile :", imageFile);
      }

      console.log("FormData avant l'envoi :", formData.get("image"));

      await dispatch(createVehicle(formData));
      toast.success("Véhicule ajouté avec succès !");
      dispatch(fetchVehicles());
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'ajout du véhicule:", err);
      toast.error("Une erreur s'est produite lors de l'ajout du véhicule.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setVehicle({
      id: 0,
      nom: "",
      marque: "",
      modele: "",
      immatriculation: "",
      nombrePlace: 0,
      type: { id: 0, type: "" },
      status: { id: 0, status: "" },
      imageUrl: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <AiOutlineCar size={24} color="#1976D2" />
          Ajouter un véhicule
        </Box>
      </DialogTitle>
      <Box
        sx={{
          p: 3,
          maxWidth: 600,
          mx: "auto",
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Informations générales
            </Typography>
          </Grid>

          {/* Image */}
          <Grid item xs={12}>
            {vehicle.imageUrl && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <img
                  src={vehicle.imageUrl}
                  alt="Preview"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Box>
            )}
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<CameraAltOutlined />}
                fullWidth
                sx={{
                  backgroundColor: "#1976D2",
                  "&:hover": { backgroundColor: "#1565C0" },
                }}
              >
                Choisir une image
              </Button>
            </label>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              name="nom"
              value={vehicle.nom}
              onChange={handleInputChange}
              error={!!errors.nom}
              helperText={errors.nom}
              InputProps={{
                startAdornment: (
                  <AiOutlineTag
                    style={{ marginRight: "8px", color: "#1976D2" }}
                  />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Marque"
              name="marque"
              value={vehicle.marque}
              onChange={handleInputChange}
              error={!!errors.marque}
              helperText={errors.marque}
              InputProps={{
                startAdornment: (
                  <AiOutlineCar
                    style={{ marginRight: "8px", color: "#1976D2" }}
                  />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Modèle"
              name="modele"
              value={vehicle.modele}
              onChange={handleInputChange}
              error={!!errors.modele}
              helperText={errors.modele}
              InputProps={{
                startAdornment: (
                  <AiOutlineCar
                    style={{ marginRight: "8px", color: "#1976D2" }}
                  />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Immatriculation"
              name="immatriculation"
              value={vehicle.immatriculation}
              onChange={handleInputChange}
              error={!!errors.immatriculation}
              helperText={errors.immatriculation}
              InputProps={{
                startAdornment: (
                  <AiOutlineNumber
                    style={{ marginRight: "8px", color: "#1976D2" }}
                  />
                ),
              }}
            />
          </Grid>

          {/* Détails supplémentaires */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Détails supplémentaires
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre de places"
              name="nombrePlace"
              type="number"
              value={vehicle.nombrePlace}
              onChange={(e) =>
                setVehicle((prev) => ({
                  ...prev,
                  nombrePlace: parseInt(e.target.value, 10),
                }))
              }
              error={!!errors.nombrePlace}
              helperText={errors.nombrePlace}
              InputProps={{
                startAdornment: (
                  <AiOutlineNumber
                    style={{ marginRight: "8px", color: "#1976D2" }}
                  />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type de véhicule</InputLabel>
              <Select
                value={vehicle.type.type}
                onChange={handleSelectType}
                displayEmpty
                inputProps={{ "aria-label": "Type de véhicule" }}
              >
                <MenuItem disabled value="">
                  Sélectionnez un type
                </MenuItem>
                {vehicleTypes.map((type) => (
                  <MenuItem key={type.id} value={type.type}>
                    {type.type}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && (
                <FormHelperText error>{errors.type}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={vehicle.status.status}
                onChange={handleSelectStatus}
                displayEmpty
                inputProps={{ "aria-label": "Statut" }}
              >
                <MenuItem disabled value="">
                  Sélectionnez un statut
                </MenuItem>
                {vehicleStatuses.map((status) => (
                  <MenuItem key={status.id} value={status.status}>
                    {status.status}
                  </MenuItem>
                ))}
              </Select>
              {errors.status && (
                <FormHelperText error>{errors.status}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            startIcon={<AiOutlineClose />}
            sx={{
              borderColor: "#FF5252",
              color: "#FF5252",
              "&:hover": { borderColor: "#E53935", color: "#E53935" },
            }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading || Object.keys(errors).length > 0}
            startIcon={
              isLoading ? <CircularProgress size={16} /> : <AiOutlineCar />
            }
            sx={{
              backgroundColor: "#1976D2",
              "&:hover": { backgroundColor: "#1565C0" },
            }}
          >
            Ajouter le véhicule
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddVehicle;
