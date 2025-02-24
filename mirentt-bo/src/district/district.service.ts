import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from 'src/entities/district.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DistrictService {
    constructor(
        @InjectRepository(District)
        private readonly districtRepository: Repository<District>
    ){}

    async create(data: {name: string; price: number; regionId: number}) {
        const district = this.districtRepository.create({
            name: data.name,
            price: data.price,
            region: {id: data.regionId}
        });
        return this.districtRepository.save(district);
    }
}
