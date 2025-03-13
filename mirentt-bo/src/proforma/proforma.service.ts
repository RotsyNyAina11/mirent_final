import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proforma } from 'src/entities/proforma.entity';
import { ProformaItem } from 'src/entities/proformat-item.entity';
import { Repository } from 'typeorm';
import { CreateProformaItemDto } from './create-proformaItem.dto';
import { Vehicule } from 'src/entities/vehicle.entity';
import { Region } from 'src/entities/region.entity';
import { Prix } from 'src/entities/prix.entity';
import { Status } from 'src/entities/status.entity';


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
            const lastNumberMatch = lastProforma[0].proformaNumber.match(/MRT (\d+)PROF/);
            if (lastNumberMatch) {
                numero = parseInt(lastNumberMatch[1], 10) + 1;
            }
        }

        const date = new Date();
        const mois = String(date.getMonth() + 1).padStart(2, '0');
        const annee = date.getFullYear();

        return `FACTURE PROFORMA N° MRT ${String(numero).padStart(3, '0')}PROF/${mois}/${annee}`;
    }

    async generateContractReference(): Promise<string> {
        const lastProforma = await this.proformaRepository.find({
            order: { id: 'DESC' },
            take: 1,
        });
    
        let numero = 1;
        if (lastProforma.length > 0) {
            const lastContractMatch = lastProforma[0].contractReference?.match(/RFQ (\d+) SURV WCO MDG (\d+)/);
            if (lastContractMatch) {
                numero = parseInt(lastContractMatch[1], 10) + 1;
            }
        }
    
        const annee = new Date().getFullYear();
    
        return `RFQ ${String(numero).padStart(3, '0')} SURV WCO MDG ${annee}`;
    }

    async create(proformaData: any): Promise<Proforma> {
        const proforma = this.proformaRepository.create({
            client: { id: proformaData.clientId },
            date: proformaData.date,
            notes: proformaData.notes,
        });

        proforma.proformaNumber = await this.generateProformaNumber();
        proforma.contractReference = await this.generateContractReference();

        const proformaItems = await Promise.all(proformaData.items.map(async (item: CreateProformaItemDto) => {
            const vehiculeExist = await this.vehiculeRepository.findOne({ where: { id: item.vehicleId } });
            if (!vehiculeExist) {
                throw new NotFoundException(`Vehicule with ID ${item.vehicleId} not found`);
            }

            const regionExist = await this.regionRepository.findOne({ where: { id: item.regionId } });
            if (!regionExist) {
                throw new NotFoundException(`Region with ID ${item.regionId} not found`);
            }

            const prixExist = await this.prixRepository.findOne({ where: { id: item.prixId } });
            if (!prixExist) {
                throw new NotFoundException(`Prix with ID ${item.prixId} not found`);
            }

            const statusDisponible = await this.statusRepository.findOne({ where: { status: 'Disponible' } });
            if (!statusDisponible) {
                throw new NotFoundException(`Statut "Disponible" non trouvé`);
            }

            if (vehiculeExist.status.id !== statusDisponible.id) {
                throw new BadRequestException(`Le véhicule ${item.vehicleId} n'est pas disponible`);
            }

            const vehiculeDejaLoue = await this.proformaItemRepository.findOne({
                where: {
                    vehicle: { id: item.vehicleId },
                    dateDepart: item.dateDepart,
                    dateRetour: item.dateRetour,
                },
            });

            if (vehiculeDejaLoue) {
                throw new BadRequestException(`Le véhicule ${item.vehicleId} est déjà loué pour cette période`);
            }

            const dureeLocation = Math.ceil((new Date(item.dateRetour).getTime() - new Date(item.dateDepart).getTime()) / (1000 * 3600 * 24));
            item.nombreJours = dureeLocation;

            const subTotal = prixExist.prix * dureeLocation;
            item.subTotal = subTotal;

            const proformaItem = this.proformaItemRepository.create({
                vehicle: { id: item.vehicleId },
                region: { id: item.regionId },
                prix: { id: item.prixId },
                dateDepart: new Date(item.dateDepart),
                dateRetour: new Date(item.dateRetour),
                nombreJours: dureeLocation,
                subTotal: subTotal,
            });

            const statusIndisponible = await this.statusRepository.findOne({ where: { status: 'Indisponible' } });
            if (!statusIndisponible) {
                throw new NotFoundException(`Statut "Indisponible" non trouvé`);
            }

            vehiculeExist.status = statusIndisponible;
            await this.vehiculeRepository.save(vehiculeExist);

            return proformaItem;
        }));

        proforma.items = await this.proformaItemRepository.save(proformaItems);

        proforma.totalAmount = proforma.items.reduce((sum, item) => sum + item.subTotal, 0);

        return this.proformaRepository.save(proforma);
    }

    async findOne(id: number): Promise<Proforma> {
        const proforma = await this.proformaRepository.findOne({
            where: { id },
            relations: ['items', 'items.vehicle', 'items.region', 'items.prix', 'client'], 
        });

        if (!proforma) {
            throw new NotFoundException(`Proforma with ID ${id} not found`);
        }

        if (typeof proforma.totalAmount === 'string') {
            proforma.totalAmount = parseFloat(proforma.totalAmount);
            await this.proformaRepository.save(proforma);
        }

        return proforma;
    }


    async findAll(): Promise<Proforma[]> {
        return this.proformaRepository.find();
    }
}