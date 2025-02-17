import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>
    ) {}


    // Recuperer tous les vehicules
    async findAll(): Promise<Vehicle[]> {
        return this.vehicleRepository.find();
    }

    // Recuperer un vehicule par son ID
    async findOne(id: number): Promise<Vehicle > {
        const vehicle = await this.vehicleRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new HttpException('Vehicle with id ${id} not found', HttpStatus.NOT_FOUND);
        }
        return vehicle;
    } 

    // Creation d'un nouvel vehicule
    async create(vehicle: Vehicle): Promise<Vehicle> {
        return this.vehicleRepository.save(vehicle);
    }

    // Mettre à jour un vehicule
    async update(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle | null> {
        const existingVehicle = await this.findOne(id); // Vérifie si le véhicule existe
        await this.vehicleRepository.update(id, vehicle);
        return this.findOne(id);
    }

    // Supprimer un vehicule
    async delete(id: number): Promise<void> {
        const result = await this.vehicleRepository.delete(id);
        if (result.affected === 0) {
          throw new HttpException(`Vehicle with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
    }

}
