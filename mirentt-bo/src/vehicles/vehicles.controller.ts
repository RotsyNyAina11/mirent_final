import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from 'src/entities/vehicle.entity';

@Controller('vehicles')
export class VehiclesController {
    constructor(
        private readonly vehiclesService: VehiclesService
    ) {}

    @Get()
    async findAllVehicles(): Promise<Vehicle[]> {
        return this.vehiclesService.findAll();
    }

    // Recuperer un vehicule par son ID
    @Get(':id')
    async findOneVehicle(@Param('id', ParseIntPipe) id: number): Promise<Vehicle | null> {
        return this.vehiclesService.findOne(id);
    }

    // Creer un nouveau vehicule
    @Post()
    @UsePipes(ValidationPipe) 
    async createVehicle(@Body() vehicle: Vehicle): Promise<Vehicle> {
      return this.vehiclesService.create(vehicle);
    }

    // Mettre à jour un vehicule
    @Put(':id')
    @UsePipes(ValidationPipe)
    async updateVehicle(@Param('id') id: number, @Body() vehicle: Vehicle): Promise<Vehicle | null> {
      return this.vehiclesService.update(+id, vehicle);
    }

    // Supprimer un véhicule
    @Delete(':id')
    async deleteVehicle(@Param('id') id: number): Promise<void> {
        return this.vehiclesService.delete(+id);
    }

}
