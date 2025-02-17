export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  available: boolean;
  category: "economy" | "luxury" | "suv" | "sport";
}
