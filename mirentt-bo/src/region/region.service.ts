import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from 'src/entities/region.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegionService {
    constructor(
        @InjectRepository(Region)
        private readonly regionRepository: Repository<Region>
    ){}

    async findAll(): Promise<Region[]>{
        return this.regionRepository.find({relations: ['districts']});
    }

    async create(data: { name: string; price: number}) {
        const region = this.regionRepository.create(data);
        return this.regionRepository.save(region);
    }
}
