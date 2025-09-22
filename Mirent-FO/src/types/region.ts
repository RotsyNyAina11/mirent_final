export interface Prix {
  id: number;
  prix: number;
}

export interface Region {
  id: number;
  nom_region: string;
  nom_district: string | null;
  prix: Prix;
}

export type CreateRegion = Omit<Region, "id" | "prix"> & { prix: Omit<Prix, "id"> };
