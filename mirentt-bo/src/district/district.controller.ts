import { Body, Controller, Post } from '@nestjs/common';
import { DistrictService } from './district.service';

@Controller('district')
export class DistrictController {
    constructor(
        private readonly districtService: DistrictService
    ){}

    @Post()
    async create(@Body() data: {name: string; price: number; regionId: number}) {
        return this.districtService.create(data);
    }
}
