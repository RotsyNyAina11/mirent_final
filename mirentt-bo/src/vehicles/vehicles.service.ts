import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from 'src/entities/type.entity';
import { Status } from 'src/entities/status.entity';
import { Repository } from 'typeorm';
import { Vehicule } from 'src/entities/vehicle.entity';
import { CreateVehiculeDto } from './createVehicule.dto';


@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(Vehicule)
        private readonly vehiculeRepository: Repository<Vehicule>,
        @InjectRepository(Type)
        private readonly typeRepository: Repository<Type>,
        @InjectRepository(Status)
        private readonly statusRepository: Repository<Status>,
    ) {}

    async getAvailableVehiculeCount(): Promise<number>{
      const availableStatus = await this.statusRepository.findOne({ where: {status: 'Disponible'}});

      if(!availableStatus){
        throw new Error('Statut "Disponible" non trouvé');
      }

      const availableVehiculeCount = await this.vehiculeRepository.count({
        where: {
          status: availableStatus,
        },
      });
      return availableVehiculeCount;
    }

     async findAll(): Promise<Vehicule[]> {
        return this.vehiculeRepository.find({ relations: ['type', 'status']});
      }
    
      async findOne(id: number): Promise<Vehicule | null> {
        return await this.vehiculeRepository.findOne({ where: { id }, relations: ['type', 'status'] }) || null;
      }
      
    
      async create(dto: CreateVehiculeDto): Promise<Vehicule> {
        const type = await this.typeRepository.findOne({ where: { id: dto.typeId } });
        const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });
    
        if (!type || !status) {
          throw new Error('Type ou Status non trouvé');
        }
    
        const vehicule = this.vehiculeRepository.create({
          ...dto,
          type,
          status,
        });
    
        return this.vehiculeRepository.save(vehicule);
      }
    
      
      async update(id: number, dto: CreateVehiculeDto): Promise<Vehicule | null> {
        const vehicule = await this.vehiculeRepository.findOne({ where: { id }, relations: ['type', 'status'] });
    
        if (!vehicule) {
            throw new Error('Véhicule non trouvé');
        }
    
        const type = await this.typeRepository.findOne({ where: { id: dto.typeId } });
        const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });
    
        if (!type || !status) {
            throw new Error('Type ou Status non trouvé');
        }
    
        // Mise à jour des propriétés
        vehicule.type = type;
        vehicule.status = status;
        vehicule.marque = dto.marque;  // Ajoute d'autres champs si besoin
    
        return await this.vehiculeRepository.save(vehicule);
    }
    
      
    
      async remove(id: number): Promise<void> {
        await this.vehiculeRepository.delete(id);
      }
}