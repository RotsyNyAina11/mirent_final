import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from 'src/entities/type.entity';
import { Status } from 'src/entities/status.entity';
import { Repository } from 'typeorm';
import { Vehicule } from 'src/entities/vehicle.entity';
import { CreateVehiculeDto } from './createVehicule.dto';
import { UpdateVehiculeDto } from './updateVehicule.dto';


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

      if (!availableStatus) {
        throw new NotFoundException('Statut "Disponible" non trouvé');
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
      
    
      async create(dto: CreateVehiculeDto, imageUrl?: string): Promise<Vehicule> {
        const type = await this.typeRepository.findOne({ where: { id: dto.typeId } });
        const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });
    
        if (!type || !status) {
          throw new Error('Type ou Status non trouvé');
        }
    
        const vehicule = this.vehiculeRepository.create({
          ...dto,
          type,
          status,
          imageUrl: imageUrl || undefined,
        });
    
        return this.vehiculeRepository.save(vehicule);
      }
    
      
      async update(id: number, dto: UpdateVehiculeDto, imageUrl?: string): Promise<Vehicule | null> {
        const vehicule = await this.vehiculeRepository.findOne({ where: { id }, relations: ['type', 'status'] });
      
        if (!vehicule) {
          throw new NotFoundException('Véhicule non trouvé');
        }
      
        const type = await this.typeRepository.findOne({ where: { id: dto.typeId } });
        const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });
      
        if (!type || !status) {
          throw new BadRequestException('Type ou Status non trouvé');
        }

        vehicule.nom = dto.nom || vehicule.nom;
        vehicule.marque = dto.marque || vehicule.marque;
        vehicule.modele = dto.modele || vehicule.modele;
        vehicule.immatriculation = dto.immatriculation || vehicule.immatriculation;
        vehicule.nombrePlace = dto.nombrePlace || vehicule.nombrePlace;
        vehicule.type = type;
        vehicule.status = status;
        vehicule.imageUrl = imageUrl || vehicule.imageUrl;
        
      
        return await this.vehiculeRepository.save(vehicule);
      }
      
      

      async remove(id: number): Promise<void> {
        await this.vehiculeRepository.delete(id);
      }
}