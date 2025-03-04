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
        console.log("DTO reçu :", dto);
        const type = await this.typeRepository.findOne({ where: { id: dto.typeId } });
        const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });

        console.log("Type récupéré :", type);
        console.log("Status récupéré :", status);
    
        if (!type || !status) {
          throw new Error('Type ou Status non trouvé');
        }
    
        const vehicule = this.vehiculeRepository.create({
          ...dto,
          type,
          status,
          imageUrl: imageUrl || undefined,
        });
        console.log("Vehicule à sauvegarder :", vehicule);
    
        return this.vehiculeRepository.save(vehicule);
      }
    
      
      async update(id: number, dto: UpdateVehiculeDto, imageUrl?: string): Promise<Vehicule | null> {
        console.log(`Mise à jour du véhicule avec l'ID : ${id}`);
        console.log('DTO reçu :', dto);
        const vehicule = await this.vehiculeRepository.findOne({ where: { id }, relations: ['type', 'status'] });

        if (!vehicule) {
            throw new NotFoundException('Véhicule non trouvé');
        }
        console.log('Véhicule récupéré :', vehicule);

        // Modification du status
        if (dto.statusId !== undefined) {
            console.log('Status avant modification :', vehicule.status);
            const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });
            if (!status) {
                throw new BadRequestException('Status non trouvé');
            }
            vehicule.status = status;
            console.log('Status après modification :', vehicule.status);
        }

        // Modification du type
        if (dto.typeId !== undefined) {
            console.log('Type avant modification :', vehicule.type);
            const type = await this.typeRepository.findOne({ where: { id: dto.typeId } });
            if (!type) {
                throw new BadRequestException('Type non trouvé');
            }
            vehicule.type = type;
            console.log('Type après modification :', vehicule.type);
        }


        vehicule.nom = dto.nom || vehicule.nom;
        vehicule.marque = dto.marque || vehicule.marque;
        vehicule.modele = dto.modele || vehicule.modele;
        vehicule.immatriculation = dto.immatriculation || vehicule.immatriculation;
        vehicule.nombrePlace = dto.nombrePlace || vehicule.nombrePlace;
        vehicule.imageUrl = imageUrl || vehicule.imageUrl;

        console.log('Véhicule avant sauvegarde :', vehicule);
        const result = await this.vehiculeRepository.save(vehicule);
        console.log('Véhicule après sauvegarde :', result);
    
        return result;
    }
      
      

      async remove(id: number): Promise<void> {
        await this.vehiculeRepository.delete(id);
      }
}