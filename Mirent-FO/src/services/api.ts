import axios from "axios";

// URL de base de votre backend
const API_URL = "http://localhost:3000/vehicles";

class VehicleService {
  // Récupérer tous les véhicules
  async getAllVehicles() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules :", error);
      throw error;
    }
  }

  // Récupérer un véhicule par ID
  async getVehicleById(id: number) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du véhicule avec l'ID ${id} :`, error);
      throw error;
    }
  }

  // Créer un nouveau véhicule
  async createVehicle(vehicle: any) {
    try {
      const response = await axios.post(API_URL, vehicle);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du véhicule :", error);
      throw error;
    }
  }

  // Mettre à jour un véhicule
  async updateVehicle(id: number, vehicle: any) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, vehicle);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du véhicule avec l'ID ${id} :`, error);
      throw error;
    }
  }

  // Supprimer un véhicule
  async deleteVehicle(id: number) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du véhicule avec l'ID ${id} :`, error);
      throw error;
    }
  }
}

export default new VehicleService();