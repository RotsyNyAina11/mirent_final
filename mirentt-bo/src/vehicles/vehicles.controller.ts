import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicule } from 'src/entities/vehicle.entity';
import { CreateVehiculeDto } from './createVehicule.dto';



@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiculesService: VehiclesService) {}


  @Get('available-count')
  async getAvailableVehiclesCount(): Promise<number> {
    return this.vehiculesService.getAvailableVehiculeCount();
  }
  @Get()
  findAll(): Promise<Vehicule[]> {
    return this.vehiculesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Vehicule | null> {
    return await this.vehiculesService.findOne(id);
  }

  @Post()
    create(@Body() dto: CreateVehiculeDto): Promise<Vehicule> {
    return this.vehiculesService.create(dto);
  }

  @Put(':id')
    update(@Param('id') id: number, @Body() dto: CreateVehiculeDto): Promise<Vehicule | null> {
    return this.vehiculesService.update(id, dto);
   }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.vehiculesService.remove(id);
  }
}