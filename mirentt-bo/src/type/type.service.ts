import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from 'src/entities/type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeService {
    constructor(
        @InjectRepository(Type)
        private readonly typesRepository: Repository<Type>
    ){}

    async findAll(): Promise<Type[]> {
        return this.typesRepository.find();
    }
}
