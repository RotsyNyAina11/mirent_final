export interface Devis {
  id: string;
  clientId: number;
  items: any[]; 
  totalAmount: number;
  startDate: string;
  endDate: string;
  includesFuel: boolean;
  fuelCostPerDay?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  client?: any; 
}
