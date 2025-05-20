import { Injectable } from '@nestjs/common';
import { CreateDevisDto } from './create-devis.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devis } from 'src/entities/devis.entity';
import { UpdateDevisDto } from './update-devis.dto';

@Injectable()
export class DevisService {
  //create devis
  async create(createDevisDto: CreateDevisDto): Promise<Devis> {
    const devis = this.devisRepository.create(createDevisDto);
    return this.devisRepository.save(devis);
  }

  //lire tous les devis
  async findAll(): Promise<Devis[]> {
    return this.devisRepository.find({
      relations: ['client', 'items', 'items.vehicule'],
    });
  }
  //lire un devis
  async findOne(id: number): Promise<Devis> {
    const devis = await this.devisRepository.findOne({
      where: { id },
      relations: ['client', 'user', 'items', 'items.vehicule'],
    });
    if (!devis) {
      throw new Error('Devis introuvable');
    }
    return devis;
  }
  //modifier un devis
  async update(id: number, updateDevisDto: UpdateDevisDto): Promise<Devis> {
    const devis = await this.findOne(id);
    if (!devis) throw new Error('Devis introuvable');

    Object.assign(devis, updateDevisDto);
    return await this.devisRepository.save(devis);
  }
  //supprimer un devis
  async remove(id: number): Promise<void> {
    await this.devisRepository.delete(id);
  }
  constructor(
    @InjectRepository(Devis)
    private devisRepository: Repository<Devis>,
  ) {}
}
