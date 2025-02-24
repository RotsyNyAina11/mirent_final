import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegionService } from './region.service';

@Controller('region')
export class RegionController {
    constructor(
        private readonly regionService: RegionService
    ){}

    @Get()
    async findAll(){
        return this.regionService.findAll();
    }

    @Post()
    async create(@Body() data: {name: string; price: number}){
        return this.regionService.create(data);
    }
}
