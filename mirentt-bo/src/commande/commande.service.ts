import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonDeCommande } from 'src/entities/commande.entity';
import { Repository } from 'typeorm';


@Injectable()
export class BonDeCommandeService {
  constructor(
    @InjectRepository(BonDeCommande)
    private bdcRepository: Repository<BonDeCommande>,
  ) {}

  async findAll(): Promise<BonDeCommande[]> {
    return this.bdcRepository.find({ relations: ['reservation', 'reservation.client', 'reservation.vehicule', 'reservation.location', 'reservation.location.prix'] });
  }

  async findOne(id: number): Promise<BonDeCommande> {
    const bdc = await this.bdcRepository.findOne({
      where: { id },
      relations: ['reservation', 'reservation.client', 'reservation.vehicule','reservation.location','reservation.location.prix'],
    });
    if (!bdc) throw new NotFoundException(`BDC with ID ${id} not found`);
    return bdc;
  }

  async remove(id: number): Promise<void> {
    const result = await this.bdcRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`BDC with ID ${id} not found`);
    }
  }
}
