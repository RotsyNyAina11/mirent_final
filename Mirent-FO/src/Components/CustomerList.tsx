import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Phone, Mail, FileText } from "lucide-react";
//import { Customer } from "../redux/slices/customerSlice";

export const CustomerList: React.FC = () => {
  const { customers, rentals } = useSelector(
    (state: RootState) => state.customer
  );

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Liste des Clients
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Permis</TableCell>
              <TableCell>Locations</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              const customerRentals = rentals.filter(
                (rental) => rental.customerId === customer.id
              );

              return (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {customer.firstName} {customer.lastName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Client depuis le{" "}
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Phone size={16} />
                      {customer.phone}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Mail size={16} />
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FileText size={16} />
                      {customer.licenseNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {customerRentals.length} location(s)
                    </Typography>
                    {customerRentals.map((rental) => (
                      <Typography
                        key={rental.id}
                        variant="caption"
                        display="block"
                        color="textSecondary"
                      >
                        {new Date(rental.startDate).toLocaleDateString()} -{" "}
                        {rental.status}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        // TODO: Implement view details
                      }}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
