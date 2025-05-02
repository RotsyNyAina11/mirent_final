import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material";

interface Contract {
  id: string;
  model: string;
  immatriculation: string;
  destination: string;
  dateDepart: string;
  dateRetour: string;
  jours: number;
  prixVente: number;
  totalNet: number;
}

interface Customer {
  id: string;
  lastName: string;
  contracts: Contract[];
}

const ClientDetails = () => {
  const clients = useSelector(
    (state: RootState) => state.customer.clients as unknown as Customer[]
  );

  return (
    <Grid container spacing={3}>
      {clients.map((client) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={client.id}>
          <Card sx={{ mb: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" noWrap sx={{ textOverflow: "ellipsis" }}>
                {client.lastName}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Nombre de contrats : {client.contracts?.length || 0}
              </Typography>

              <List>
                {client.contracts &&
                  client.contracts.length > 0 &&
                  client.contracts.map((contract) => (
                    <div key={contract.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${contract.model} (${contract.immatriculation})`}
                          secondary={
                            <Stack spacing={1}>
                              <Typography variant="body2">
                                Destination: {contract.destination}
                              </Typography>
                              <Typography variant="body2">
                                Période: {contract.dateDepart} -{" "}
                                {contract.dateRetour} ({contract.jours} jours)
                              </Typography>
                              <Typography variant="body2">
                                Prix Vente: {contract.prixVente} | Total:{" "}
                                {contract.totalNet}
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ClientDetails;
