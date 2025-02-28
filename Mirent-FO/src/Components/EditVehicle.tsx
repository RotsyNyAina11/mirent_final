import { Box, Button, Dialog, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { AiOutlineCar, AiOutlineClose, AiOutlineEdit, AiOutlineNumber, AiOutlineTag } from "react-icons/ai";
import { CameraAltOutlined } from "@mui/icons-material";
import { updateVehicle, Vehicle, fetchVehicleTypes, fetchVehicleStatuses } from "../redux/slices/vehiclesSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { RootState } from "../redux/store";
import { toast } from 'react-toastify';  // Importer react-toastify

interface EditVehicleProps {
    open: boolean;
    onClose: () => void;
    vehicle: Vehicle;
}

const EditVehicle: React.FC<EditVehicleProps> = ({ open, onClose, vehicle }) => {
    const [nom, setNom] = useState(vehicle.nom);
    const [marque, setMarque] = useState(vehicle.marque);
    const [modele, setModele] = useState(vehicle.modele);
    const [immatriculation, setImmatriculation] = useState(vehicle.immatriculation);
    const [nombrePlace, setNombrePlace] = useState(vehicle.nombrePlace);
    const [type, setType] = useState(vehicle.type.id);
    const [status, setStatus] = useState(vehicle.status.id);
    const [image, setImage] = useState<File | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const vehicleTypes = useSelector((state: RootState) => state.vehicles.vehiclesType);
    const vehicleStatuses = useSelector((state: RootState) => state.vehicles.vehiclesStatus);

    useEffect(() => {
        if (open) {
            dispatch(fetchVehicleTypes());
            dispatch(fetchVehicleStatuses());
        }
    }, [open, dispatch]);

    useEffect(() => {
        console.log("Vehicle Object:", vehicle);
    }, [vehicle]);

    const handleUpdate = () => {

        if (!nom || !marque || !modele || !immatriculation || !nombrePlace || !type || !status) {
            toast.error("Tous les champs doivent être remplis.");
            return;
        }

        const formData = new FormData();
        formData.append("nom", nom);
        formData.append("marque", marque);
        formData.append("modele", modele);
        formData.append("immatriculation", immatriculation);
        formData.append("nombrePlace", nombrePlace.toString());
        formData.append("type", type.toString());
        formData.append("status", status.toString());
        if (image) {
            formData.append("image", image);
        }
        dispatch(updateVehicle({ id: vehicle.id!, formData }))
            .unwrap()
            .then(() => {
                toast.success("Véhicule modifié avec succès");  // Afficher une notification de succès
                onClose();
            })
            .catch((error) => {
                console.error("Erreur lors de la mise à jour :", error);
                toast.error("Erreur lors de la mise à jour du véhicule");  // Afficher une notification d'erreur
            });
    };

    const handleCancel = () => {
        setNom(vehicle.nom);
        setMarque(vehicle.marque);
        setModele(vehicle.modele);
        setImmatriculation(vehicle.immatriculation);
        setNombrePlace(vehicle.nombrePlace);
        setType(vehicle.type.id);
        setStatus(vehicle.status.id);
        setImage(null);  // Réinitialiser l'image
        onClose();  // Fermer la boîte de dialogue
    };

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
                                src={image ? URL.createObjectURL(image) : (typeof vehicle.imageUrl === "string" && vehicle.imageUrl ? vehicle.imageUrl : "../assets/img-placeholder.jpg")}
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
                                    <AiOutlineTag style={{ marginRight: "8px", color: "#1976D2" }} />
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
                                    <AiOutlineCar style={{ marginRight: "8px", color: "#1976D2" }} />
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
                                    <AiOutlineCar style={{ marginRight: "8px", color: "#1976D2" }} />
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
                                    <AiOutlineNumber style={{ marginRight: "8px", color: "#1976D2" }} />
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
                                    <AiOutlineNumber style={{ marginRight: "8px", color: "#1976D2" }} />
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
                                onChange={(e) => setType(e.target.value as number)}
                                 displayEmpty
                                 inputProps={{ "aria-label": "Type de véhicule" }}
                             >
                                 {vehicleTypes.map((t: any) => (
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
                                onChange={(e) => setStatus(e.target.value as number)}
                                inputProps={{ "aria-label": "Statut" }}
                            >
                                {vehicleStatuses.map((s: any) => (
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
