import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devis } from 'src/entities/devis.entity';
import { Client } from 'src/entities/client.entity';
import { Region } from 'src/entities/region.entity';
import { DevisItem } from 'src/entities/devis-item.entity';
import { UpdateDevisDto } from './update-devis.dto';
import { CreateDevisItemDto } from './create-devis.dto';
import { Vehicule } from 'src/entities/vehicle.entity';

@Injectable()
export class DevisService {
  constructor(
    @InjectRepository(Devis)
    private readonly devisRepository: Repository<Devis>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @InjectRepository(Vehicule)
    private readonly vehicleRepository: Repository<Vehicule>,

    @InjectRepository(DevisItem)
    private readonly devisItemRepository: Repository<DevisItem>,
  ) {}

  async create(createDevisDto: CreateDevisItemDto): Promise<Devis> {
    const client = await this.clientRepository.findOne({
      where: { id: Number(createDevisDto.clientName) },
    });

    if (!client) {
      throw new NotFoundException('Client non trouvé.');
    }

    const devis = this.devisRepository.create({
      numeroDevis: await this.generateDevisNumber(),
      client,
      remarque: createDevisDto.remarque,
      dateCreation: createDevisDto.dateCreation,
      prixCarburant: createDevisDto.prixCarburant,
      prixTotal: 0,
      items: [],
    });

    const vehicule = await this.vehicleRepository.findOne({
      where: {},
    });

    for (const itemDto of createDevisDto.items) {
      const region = await this.regionRepository.findOne({
        where: { id: itemDto.regionId },
        relations: ['prix'],
      });

      if (!region) {
        throw new NotFoundException('Région non trouvée.');
      }
      if (!region.prix) {
        throw new NotFoundException('Prix non trouvé pour cette région.');
      }
      const prixExiste = region.prix;

      const devisItem = this.devisItemRepository.create({
        ...itemDto,
        region,
        devis,
      });

      devis.items.push(devisItem);
    }

    return this.devisRepository.save(devis);
  }

  async generateDevisNumber(): Promise<string> {
    const lastDevis = await this.devisRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });

    let numero = 1;
    if (lastDevis.length > 0) {
      const match = lastDevis[0].numeroDevis.match(/MRT (\d+)DEV/);
      if (match) {
        numero = parseInt(match[1], 10) + 1;
      }
    }

    const date = new Date();
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const annee = date.getFullYear();

    return `DEVIS N° MRT ${String(numero).padStart(3, '0')}DEV/${mois}/${annee}`;
  }

  async findAll(): Promise<Devis[]> {
    return this.devisRepository.find({
      relations: [
        'client',
        'items',
        'items.region',
        'items.prix',
        'items.vehicule',
      ],
    });
  }

  async findOne(id: number): Promise<Devis> {
    const devis = await this.devisRepository.findOne({
      where: { id },
      relations: [
        'client',
        'items',
        'items.region',
        'items.prix',
        'items.vehicule',
      ],
    });

    if (!devis) {
      throw new NotFoundException('Devis non trouvé.');
    }

    return devis;
  }

  async update(id: number, updateDevisDto: UpdateDevisDto): Promise<Devis> {
    const devis = await this.devisRepository.findOne({ where: { id } });

    if (!devis) {
      throw new NotFoundException('Devis non trouvé.');
    }

    Object.assign(devis, updateDevisDto);

    return this.devisRepository.save(devis);
  }

  async remove(id: number): Promise<void> {
    const devis = await this.devisRepository.findOne({ where: { id } });

    if (!devis) {
      throw new NotFoundException('Devis non trouvé.');
    }

    await this.devisRepository.remove(devis);
  }

  async delete(): Promise<void> {
    const devis = await this.devisRepository.find();
    if (devis.length === 0) {
      throw new NotFoundException('Aucun devis trouvé.');
    }

    await this.devisRepository.remove(devis);
  }
}
