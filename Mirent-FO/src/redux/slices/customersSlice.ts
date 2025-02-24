import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer, Rental } from "../../types/customer";

interface CustomersState {
  customers: Customer[];
  rentals: Rental[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [
    {
      id: "1",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@email.com",
      phone: "0612345678",
      licenseNumber: "B123456789",
      createdAt: "2024-02-20",
    },
    {
      id: "2",
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@email.com",
      phone: "0687654321",
      licenseNumber: "B987654321",
      createdAt: "2024-02-21",
    },
  ],
  rentals: [
    {
      id: "3",
      customerId: "1",
      vehicleId: "1",
      startDate: "2024-02-25",
      endDate: "2024-02-28",
      totalPrice: 150,
      status: "active",
    },
  ],
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
    addRental: (state, action: PayloadAction<Rental>) => {
      state.rentals.push(action.payload);
    },
    updateRentalStatus: (
      state,
      action: PayloadAction<{ id: string; status: Rental["status"] }>
    ) => {
      const rental = state.rentals.find((r) => r.id === action.payload.id);
      if (rental) {
        rental.status = action.payload.status;
      }
    },
  },
});

export const { addCustomer, addRental, updateRentalStatus } =
  customersSlice.actions;
export default customersSlice.reducer;
