import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  AiOutlineCar,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineNumber,
  AiOutlineTag,
} from "react-icons/ai";
import { CameraAltOutlined } from "@mui/icons-material";
import { updateVehicle, Vehicle, fetchVehicleTypes, fetchVehicleStatuses } from "../../redux/features/vehicle/vehiclesSlice";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store";
import { toast } from 'react-toastify';  

interface EditVehicleProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

interface VehicleType {
  id: number;
  type: string;
}

interface VehicleStatus {
  id: number;
  status: string;
}

const EditVehicle: React.FC<EditVehicleProps> = ({
  open,
  onClose,
  vehicle,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const vehicleTypes = useSelector(
    (state: RootState) => state.vehicles.vehiclesType
  ) as VehicleType[];
  const vehicleStatuses = useSelector(
    (state: RootState) => state.vehicles.vehiclesStatus
  ) as VehicleStatus[];
  const vehicleTypesLoading = useSelector(
    (state: RootState) => state.vehicles.vehiclesTypeLoading
  );
  const vehicleStatusesLoading = useSelector(
    (state: RootState) => state.vehicles.vehiclesStatusLoading
  );
  const vehicleTypesError = useSelector(
    (state: RootState) => state.vehicles.vehiclesTypeError
  );
  const vehicleStatusesError = useSelector(
    (state: RootState) => state.vehicles.vehiclesStatusError
  );

  const [type, setType] = useState<number>(vehicle.type.id); 
  const [status, setStatus] = useState<number>(vehicle.status.id); 

  const [nom, setNom] = useState(vehicle.nom || "");
  const [marque, setMarque] = useState(vehicle.marque || "");
  const [modele, setModele] = useState(vehicle.modele || "");
  const [immatriculation, setImmatriculation] = useState(
    vehicle.immatriculation || ""
  );
  const [nombrePlace, setNombrePlace] = useState(vehicle.nombrePlace || 0);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);


  useEffect(() => {
    if (vehicleTypes.length > 0) {
      console.log("Vehicle Types:", vehicleTypes);
    }
    if (vehicleStatuses.length > 0) {
      console.log("Vehicle Statuses:", vehicleStatuses);
    }
  }, [vehicleTypes, vehicleStatuses]);

  const handleUpdate = useCallback(() => {
    if (
      !nom ||
      !marque ||
      !modele ||
      !immatriculation ||
      !nombrePlace ||
      !type ||
      !status
    ) {
      toast.error("Tous les champs doivent être remplis.");
      return;
    }

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("marque", marque);
    formData.append("modele", modele);
    formData.append("immatriculation", immatriculation);
    formData.append("nombrePlace", nombrePlace.toString());
    formData.append("typeId", type.toString());
    formData.append("statusId", status.toString());
    if (image) {
      formData.append("image", image);
    }
    console.log("FormData:", formData);
    setIsUpdating(true);
    if (vehicle.id) {
      dispatch(updateVehicle({ id: vehicle.id, formData }))
        .unwrap()
        .then(() => {
          setIsUpdating(false);
          toast.success("Véhicule modifié avec succès");
          onClose();
        })
        .catch((error) => {
          setIsUpdating(false);
          console.error("Erreur lors de la mise à jour :", error);
          toast.error("Erreur lors de la mise à jour du véhicule");
        });
    }
  }, [
    dispatch,
    vehicle,
    nom,
    marque,
    modele,
    immatriculation,
    nombrePlace,
    type,
    status,
    image,
    onClose,
  ]);

  const handleCancel = useCallback(() => {
    setNom(vehicle.nom);
    setMarque(vehicle.marque);
    setModele(vehicle.modele);
    setImmatriculation(vehicle.immatriculation);
    setNombrePlace(vehicle.nombrePlace);
    setType(vehicle.type.id);
    setStatus(vehicle.status.id);
    setImage(null);
    onClose();
  }, [vehicle, onClose]);

  const defaultImageUrl = "../assets/img-placeholder.jpg";
  const imageUrl = image
    ? URL.createObjectURL(image)
    : typeof vehicle.imageUrl === "string" && vehicle.imageUrl
    ? vehicle.imageUrl
    : defaultImageUrl;

  if (vehicleTypesLoading || vehicleStatusesLoading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Chargement...</DialogTitle>
      </Dialog>
    );
  }

  if (vehicleTypesError || vehicleStatusesError) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Erreur lors du chargement des données.</DialogTitle>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <AiOutlineEdit size={24} color="#1976D2" />
          Modifier un véhicule
        </Box>
      </DialogTitle>
      <Box
        sx={{
          p: 3,
          maxWidth: 600,
          mx: "auto",
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: "0px 4px 6px rgba(0, 0, 0.1)",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Informations générales
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <img
                src={previewImage || imageUrl}
                style={{
                  width: "200px",
                  maxHeight: "200px",
                  objectFit: "cover",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />
            </Box>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="contained-button-file"
              multiple
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
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
                Changer l'image
              </Button>
            </label>
          </Grid>

          {/* Formulaire pour le véhicule */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              name="nom"
              InputProps={{
                startAdornment: (
                  <AiOutlineTag
                    style={{ marginRight: "8px", color: "#1976D2" }}
                  />
                ),
              }}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Marque"
              name="marque"
              InputProps={{
                startAdornment: (
                  <AiOutlineCar
                    style={{ marginRight: "8px", color: "#1976D2" }}
                  />
                ),
              }}
              value={marque}
              onChange={(e) => setMarque(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Modèle"
              name="modele"
              InputProps={{
                startAdornment: (
                  <AiOutlineCar
                    style={{ marginRight: "8px", color: "#1976D2" }}
                  />
                ),
              }}
              value={modele}
              onChange={(e) => setModele(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Immatriculation"
              name="immatriculation"
              InputProps={{
                startAdornment: (
                  <AiOutlineNumber
                    style={{ marginRight: "8px", color: "#1976D2" }}
                  />
                ),
              }}
              value={immatriculation}
              onChange={(e) => setImmatriculation(e.target.value)}
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
              InputProps={{
                startAdornment: (
                  <AiOutlineNumber
                    style={{ marginRight: "8px", color: "#1976D2" }}
                  />
                ),
              }}
              value={nombrePlace}
              onChange={(e) => setNombrePlace(parseInt(e.target.value))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type de véhicule</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(Number(e.target.value))}
                displayEmpty
                inputProps={{ "aria-label": "Type de véhicule" }}
              >
                {vehicleTypes.map((t: VehicleType) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                inputProps={{ "aria-label": "Statut" }}
              >
                {vehicleStatuses.map((s: VehicleStatus) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.status}
                  </MenuItem>
                ))}
              </Select>
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
            startIcon={<AiOutlineClose />}
            sx={{
              borderColor: "#FF5252",
              color: "#FF5252",
              "&:hover": { borderColor: "#E53935", color: "#E53935" },
            }}
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#1976D2",
              "&:hover": { backgroundColor: "#1565C0" },
            }}
            disabled={isUpdating}
            onClick={handleUpdate}
          >
            Modifier le véhicule
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditVehicle;
