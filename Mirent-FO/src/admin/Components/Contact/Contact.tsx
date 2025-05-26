import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CallIcon from "@mui/icons-material/Call";
import HomeIcon from "@mui/icons-material/Home";

const Contact = () => {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("mirent.mdg@gmail.com");
    alert("Email copié !");
  };

  const openMap = () => {
    window.open(
      "https://www.google.com/maps?q=LOT+II+P+136+Ter+Avaradoha+Antananarivo+101",
      "_blank"
    );
  };

  return (
    <Box textAlign="center" py={6}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Besoin de nous contacter ?
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        N'hésitez pas à prendre contact avec nous !
      </Typography>

      <Grid container spacing={4} justifyContent="center" mt={3}>
        {/* Adresse */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <HomeIcon fontSize="large" />
              <Typography variant="h6" fontWeight="bold" mt={1}>
                Notre Adresse
              </Typography>
              <Typography fontStyle="italic" mt={1}>
                LOT II P 136 Ter Avaradoha Antananarivo 101
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<LocationOnIcon />}
                onClick={openMap}
                sx={{ mt: 2 }}
              >
                Ouvrir une carte
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Téléphone */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <PhoneIcon fontSize="large" />
              <Typography variant="h6" fontWeight="bold" mt={1}>
                Téléphone
              </Typography>
              <Typography fontStyle="italic" mt={1}>
                +261 38 13 690 04
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CallIcon />}
                href="tel:+261 38 13 690 04"
                sx={{ mt: 2 }}
              >
                Appeler
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <EmailIcon fontSize="large" />
              <Typography variant="h6" fontWeight="bold" mt={1}>
                Adresse mail
              </Typography>
              <Typography fontStyle="italic" mt={1}>
                mirent.mdg@gmail.com
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyEmail}
                sx={{ mt: 2 }}
              >
                Copier
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer */}
      <Typography mt={6} fontWeight="bold">
        CHEZ MIRENT
      </Typography>
      <Typography variant="body2" color="text.secondary">
        ©2025
      </Typography>
    </Box>
  );
};

export default Contact;
