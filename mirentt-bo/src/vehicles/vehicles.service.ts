import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicule } from 'src/entities/vehicle.entity';
import { Type } from 'src/entities/type.entity';
import { Status } from 'src/entities/status.entity';
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

  // Compter les véhicules disponibles
  async getAvailableVehiculeCount(): Promise<number> {
    const availableStatus = await this.statusRepository.findOne({
      where: { status: 'Disponible' },
    });
    if (!availableStatus) throw new NotFoundException('Statut "Disponible" non trouvé');

    return this.vehiculeRepository.count({ where: { status: availableStatus } });
  }

  // Récupérer tous les véhicules
  async findAll(): Promise<Vehicule[]> {
    return this.vehiculeRepository.find({ relations: ['type', 'status'] });
  }

  // Récupérer un véhicule par ID
  async findOne(id: number): Promise<Vehicule | null> {
    return this.vehiculeRepository.findOne({
      where: { id },
      relations: ['type', 'status'],
    }) || null;
  }

  // Créer un véhicule
  async create(dto: CreateVehiculeDto, imageUrl?: string): Promise<Vehicule> {
    const type = await this.typeRepository.findOne({ where: { id: dto.typeId } });
    const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });

    if (!type || !status) throw new NotFoundException('Type ou Status non trouvé');

    const vehicule =this.vehiculeRepository.create({
      nom: dto.nom,
      marque: dto.marque,
      modele: dto.modele,
      immatriculation: dto.immatriculation,
      nombrePlace: dto.nombrePlace,
      imageUrl: dto.imageUrl,
      distance_moyenne: dto.distance_moyenne,
      derniere_visite: dto.derniere_visite,

      type: { id: dto.typeId },      
      status: { id: dto.statusId },  
    });


    return this.vehiculeRepository.save(vehicule);
  }

  // Mettre à jour un véhicule
  async update(id: number, dto: UpdateVehiculeDto, imageUrl?: string): Promise<Vehicule> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
      relations: ['type', 'status'],
    });
    if (!vehicule) throw new NotFoundException('Véhicule non trouvé');

    if (dto.statusId !== undefined) {
      const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });
      if (!status) throw new BadRequestException('Status non trouvé');
      vehicule.status = status;
    }

    if (dto.typeId !== undefined) {
      const type = await this.typeRepository.findOne({ where: { id: dto.typeId } });
      if (!type) throw new BadRequestException('Type non trouvé');
      vehicule.type = type;
    }

    vehicule.nom = dto.nom ?? vehicule.nom;
    vehicule.marque = dto.marque ?? vehicule.marque;
    vehicule.modele = dto.modele ?? vehicule.modele;
    vehicule.immatriculation = dto.immatriculation ?? vehicule.immatriculation;
    vehicule.nombrePlace = dto.nombrePlace ?? vehicule.nombrePlace;
    vehicule.imageUrl = imageUrl ?? vehicule.imageUrl;
    vehicule.distance_moyenne = dto.distance_moyenne ?? vehicule.distance_moyenne;
    vehicule.derniere_visite = dto.derniere_visite ? new Date(dto.derniere_visite) : vehicule.derniere_visite;


    return this.vehiculeRepository.save(vehicule);
  }

  // Mettre à jour le statut par ID
  async updateStatus(id: number, statusId: number): Promise<Vehicule> {
    const vehicule = await this.vehiculeRepository.findOne({ where: { id }, relations: ['status'] });
    if (!vehicule) throw new NotFoundException('Véhicule non trouvé');

    const status = await this.statusRepository.findOne({ where: { id: statusId } });
    if (!status) throw new NotFoundException('Statut non trouvé');

    vehicule.status = status;
    return this.vehiculeRepository.save(vehicule);
  }

  // Mettre à jour le statut par nom
  async updateStatusByName(vehicleId: number, statusName: string): Promise<Vehicule> {
    const vehicule = await this.vehiculeRepository.findOne({ where: { id: vehicleId }, relations: ['status'] });
    if (!vehicule) throw new NotFoundException('Véhicule non trouvé');

    const status = await this.statusRepository.findOne({ where: { status: statusName } });
    if (!status) throw new NotFoundException(`Statut "${statusName}" introuvable`);

    vehicule.status = status;
    return this.vehiculeRepository.save(vehicule);
  }

  // Supprimer un véhicule
  async remove(id: number): Promise<void> {
    await this.vehiculeRepository.delete(id);
  }
}
