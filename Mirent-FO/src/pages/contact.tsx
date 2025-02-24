import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

const ContactPage: React.FC = () => {
  // État pour les champs du formulaire
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // État pour gérer les messages de succès ou d'erreur
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Gestion des changements dans les champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setStatus("error");
      return;
    }

    // Simuler l'envoi du formulaire (remplacer par un appel API réel)
    console.log("Formulaire soumis :", formData);
    setStatus("success");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Contactez-nous
      </Typography>
      <Typography variant="body1" gutterBottom>
        Si vous avez des questions ou des commentaires, n'hésitez pas à nous
        contacter en utilisant le formulaire ci-dessous.
      </Typography>

      {/* Formulaire de contact */}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Nom"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Sujet"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
        />

        {/* Bouton de soumission */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Envoyer
        </Button>

        {/* Affichage des messages de succès ou d'erreur */}
        {status === "success" && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Votre message a été envoyé avec succès !
          </Alert>
        )}
        {status === "error" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Veuillez remplir tous les champs du formulaire.
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default ContactPage;
