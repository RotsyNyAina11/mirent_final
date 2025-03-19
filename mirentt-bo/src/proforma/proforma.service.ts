import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proforma } from 'src/entities/proforma.entity';
import { ProformaItem } from '../entities/proformat-item.entity';
import { Vehicule } from 'src/entities/vehicle.entity';
import { Region } from 'src/entities/region.entity';
import { Prix } from 'src/entities/prix.entity';
import { Status } from 'src/entities/status.entity';
import { CreateProformaItemDto } from './create-proformaItem.dto';

@Injectable()
export class ProformaService {
  constructor(
    @InjectRepository(Proforma)
    private readonly proformaRepository: Repository<Proforma>,
    @InjectRepository(ProformaItem)
    private readonly proformaItemRepository: Repository<ProformaItem>,
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @InjectRepository(Prix)
    private readonly prixRepository: Repository<Prix>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async generateProformaNumber(): Promise<string> {
    const lastProforma = await this.proformaRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });

    let numero = 1;
    if (lastProforma.length > 0) {
      const lastNumberMatch =
        lastProforma[0].proformaNumber.match(/MRT (\d+)PROF/);
      if (lastNumberMatch) {
        numero = parseInt(lastNumberMatch[1], 10) + 1;
      }
    }

    const date = new Date();
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const annee = date.getFullYear();

    return `FACTURE PROFORMA N° MRT ${String(numero).padStart(3, '0')}PROF/${mois}/${annee}`;
  }

  async create(proformaData: any): Promise<Proforma> {
    try {
      const proforma = this.proformaRepository.create({
        client: { id: proformaData.clientId },
        date: proformaData.date,
        notes: proformaData.notes,
      });

      proforma.proformaNumber = await this.generateProformaNumber();

      const proformaItems = await Promise.all(
        proformaData.items.map(async (item: CreateProformaItemDto) => {
          const vehiculeExist = await this.vehiculeRepository.findOne({
            where: { id: Number(item.vehicleId) },
          });
          if (!vehiculeExist)
            throw new NotFoundException(
              `Véhicule ID ${item.vehicleId} introuvable`,
            );

          const regionExist = await this.regionRepository.findOne({
            where: { id: Number(item.regionId) },
          });
          if (!regionExist)
            throw new NotFoundException(
              `Région ID ${item.regionId} introuvable`,
            );

          const prixExist = await this.prixRepository.findOne({
            where: { id: item.prixId },
          });
          if (!prixExist)
            throw new NotFoundException(`Prix ID ${item.prixId} introuvable`);

          const statusDisponible = await this.statusRepository.findOne({
            where: { status: 'Disponible' },
          });
          if (!statusDisponible)
            throw new NotFoundException(`Statut 'Disponible' non trouvé`);

          if (vehiculeExist.status.id !== statusDisponible.id) {
            throw new BadRequestException(
              `Le véhicule ${item.vehicleId} n'est pas disponible`,
            );
          }

          const vehiculeDejaLoue = await this.proformaItemRepository.findOne({
            where: {
              vehicle: { id: Number(item.vehicleId) },
              dateDepart: new Date(item.dateDepart),
              dateRetour: new Date(item.dateRetour),
            },
          });
          if (vehiculeDejaLoue) {
            throw new BadRequestException(
              `Le véhicule ${item.vehicleId} est déjà loué`,
            );
          }

          const dateDepart = new Date(item.dateDepart);
          const dateRetour = new Date(item.dateRetour);
          const dureeLocation = Math.ceil(
            (dateRetour.getTime() - dateDepart.getTime()) / (1000 * 3600 * 24),
          );
          item.nombreJours = dureeLocation;

          const subTotal = prixExist.prix * dureeLocation;
          item['subTotal'] = subTotal;

          const proformaItem = this.proformaItemRepository.create({
            vehicle: { id: Number(item.vehicleId) },
            region: { id: Number(item.regionId) },
            prix: { id: Number(item.prixId) },
            dateDepart,
            dateRetour,
            nombreJours: dureeLocation,
            subTotal,
          });

          const statusIndisponible = await this.statusRepository.findOne({
            where: { status: 'Indisponible' },
          });
          if (!statusIndisponible)
            throw new NotFoundException(`Statut 'Indisponible' non trouvé`);

          vehiculeExist.status = statusIndisponible;
          await this.vehiculeRepository.save(vehiculeExist);

          return proformaItem;
        }),
      );

      proforma.items = await this.proformaItemRepository.save(proformaItems);
      proforma.totalAmount = proforma.items.reduce(
        (sum, item) => sum + item.subTotal,
        0,
      );

      return this.proformaRepository.save(proforma);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erreur lors de la création de la proforma',
      );
    }
  }

  async findOne(id: number): Promise<Proforma> {
    const proforma = await this.proformaRepository.findOne({
      where: { id },
      relations: [
        'items',
        'items.vehicle',
        'items.region',
        'items.prix',
        'client',
      ],
    });

    if (!proforma) throw new NotFoundException(`Proforma ID ${id} introuvable`);
    return proforma;
  }

  async findAll(): Promise<Proforma[]> {
    return this.proformaRepository.find();
  }
}
