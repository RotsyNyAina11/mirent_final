import axios from "axios";

const API_URL = "http://localhost:3000/vehicles";

class VehicleService {
  // Récupère tous les véhicules
  async getAllVehicles() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules :", error);
      throw this.handleError(error);
    }
  }

  // Récupère un véhicule par son ID
  async getVehicleById(id: number) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du véhicule avec l'ID ${id}`, error);
      throw this.handleError(error);
    }
  }

  //  Crée un véhicule
  async createVehicle(vehicleData: any) {
    try {
      const response = await axios.post(API_URL, vehicleData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du véhicule :", error);
      throw this.handleError(error);
    }
  }

  // Met à jour un véhicule
  async updateVehicle(id: number, vehicle: any) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, vehicle);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du véhicule avec l'ID ${id}`, error);
      throw this.handleError(error);
    }
  }

  // Supprime un véhicule
  async deleteVehicle(id: number) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du véhicule avec l'ID ${id}`, error);
      throw this.handleError(error);
    }
  }

  // Gestion des erreurs
  private handleError(error: any) {
    if (error.response) {
      return new Error(`Code d'erreur : ${error.response.status}: ${error.response.data.message}`)
    } else if (error.request) {
      return new Error("Aucune réponse du serveur. Veuillez vérifier votre connexion.");
    } else {
      return new Error("Une erreur est survenue lors de la requête. Veuillez réessayer.");
    }
  }
}

export default new VehicleService();