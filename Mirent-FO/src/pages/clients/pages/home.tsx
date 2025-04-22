import { Accordion, AccordionDetails, AccordionSummary, AppBar, Avatar, Box, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/horizontal.png";
import image from "../../../assets/1.jpg";

const ClientHome: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: "#0f172a", color: "white", minHeight: "100vh" }}>
            {/* Navbar */}
            <AppBar position="sticky" sx={{ bgcolor: "#1e293b"}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <img src={logo} alt="Mirent  Location" style={{ height: '2em'}}/>
                    </Typography>
                    <Button color="inherit" onClick={() => navigate("/catalogue")}>
                        Catalogue
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Section hero */}
            <Container maxWidth="lg" sx={{pt: 10}}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                            <Typography variant="h2" fontWeight="bold" gutterBottom>
                                Louez le véhicule parfait.
                            </Typography>
                            <Typography variant="h6" color="gray" paragraph>
                                Découvrez notre sélection de voitures pour tous vos déplacements à Madagascar.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<DirectionsCarIcon />}
                                onClick={() => navigate("/catalogue")}
                                sx={{ mt: 3 }}
                            >
                                Voir les véhicules
                            </Button>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <img
                            src={image}
                            alt="Car rental"
                            style={{ width: "100%", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)"}}
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* Section de Présentation */}
            <Box sx={{bgcolor: "#1e293b", py: 10, mt: 8}}>
                <Container maxWidth="md">
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                        Pourquoi choisir notre service?
                    </Typography>
                    <Typography variant="body1" align="center" color="gray">
                        Un large choix de véhicules bien entretenus, un service client à l'écoute et des tarifs compétitifs.
                    </Typography>
                </Container>
            </Box>

            {/* Témoignages */}
            <Box sx={{ py: 10 }}>
                <Container maxWidth="md">
                    <Typography variant="h4" fontWeight={"bold"} align={"center"} gutterBottom>
                        Témoignages
                    </Typography>
                    <Grid container spacing={4}>
                        {[1, 2, 3].map((index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Paper elevation={3} sx={{ p: 3, bgcolor: "#1e293b" }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar sx={{ mr: 2 }}/>
                                        <Box>
                                            <Typography variant="subtitle1">Client {index}</Typography>
                                            <Typography variant="caption" color="gray">
                                             ⭐⭐⭐⭐⭐
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography color="gray">
                                        Service rapide, voiture propre et confortable. Je recommande totalement!
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* FAQ */}
            <Box sx={{ bgcolor: "#1e293b", py: 10 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
            Questions Fréquentes
          </Typography>
          <Accordion sx={{ bgcolor: "#334155", color: "white" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
              <Typography>Quels documents faut-il pour louer ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Une carte d’identité, un permis de conduire valide et un dépôt de garantie.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ bgcolor: "#334155", color: "white", mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
              <Typography>Proposez-vous des assurances ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Oui, une assurance de base est incluse dans chaque location.</Typography>
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>

       {/* Footer */}
        <Box sx={{ bgcolor: "#0f172a", py: 6, borderTop: "1px solid #1e293b" }}>
        <Container maxWidth="lg">
            <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <img src={logo} alt="Mirent  Location" style={{ height: '2em'}}/>
                </Typography>
                <Typography color="gray">
                Louez le véhicule parfait pour explorer Madagascar.
                </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Contact
                </Typography>
                <Typography color="gray">Email : mirent.mdg@gmail.com</Typography>
                <Typography color="gray">Tél : +261 34 00 000 00</Typography>
                <Typography color="gray">Antananarivo, Madagascar</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Suivez-nous
                </Typography>
                <Typography color="gray">Facebook</Typography>
                <Typography color="gray">Instagram</Typography>
                <Typography color="gray">Twitter</Typography>
            </Grid>
            </Grid>
            <Typography variant="body2" color="gray" align="center" sx={{ mt: 4 }}>
            © {new Date().getFullYear()} MirentLocation. Tous droits réservés.
            </Typography>
        </Container>
        </Box>

    </Box>
    );
};
export default ClientHome; 