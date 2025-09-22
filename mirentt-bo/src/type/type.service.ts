import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from 'src/entities/type.entity';
import { Repository } from 'typeorm';
import { CreateTypeDto } from './dto/create-type.dto';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private readonly typesRepository: Repository<Type>,
  ) {}

  async findAll(): Promise<Type[]> {
    return this.typesRepository.find();
  }

  async create(dto: CreateTypeDto): Promise<Type> {
    // Vérifie si un type avec ce nom existe déjà
    const existingType = await this.typesRepository.findOne({
      where: { type: dto.type },
    });

    if (existingType) {
      throw new BadRequestException(
        `Le type "${dto.type}" existe déjà.`
      );
    }

    // Crée et sauvegarde le nouveau type
    const newType = this.typesRepository.create(dto);
    return await this.typesRepository.save(newType);
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.typesRepository.delete(id);
      if (result.affected === 0) {
        // L'élément n'a pas été trouvé
        throw new NotFoundException(`Le type avec l'ID ${id} n'existe pas.`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      throw new InternalServerErrorException(
        'Erreur lors de la suppression du type.',
      );
    }
  }

  async update(id: number, dto: Partial<Type>): Promise<Type> {
    const existingType = await this.typesRepository.findOneBy({ id });

    if (!existingType) {
      throw new NotFoundException(`Type avec ID ${id} introuvable`);
    }

    await this.typesRepository.update(id, dto);

    const updatedType = await this.typesRepository.findOneBy({ id });
    if (!updatedType) {
      throw new NotFoundException(`Type avec ID ${id} introuvable après la mise à jour`);
    }

    return updatedType;
  }


}
