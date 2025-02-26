import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicule } from 'src/entities/vehicle.entity';
import { CreateVehiculeDto } from './createVehicule.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';



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
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        }
      })
    }))
    async create(
      @Body() dto: CreateVehiculeDto,
      @UploadedFile() file: Express.Multer.File
    ): Promise<Vehicule> {
      const imageUrl: string | undefined = file 
        ? `http://localhost:3000/uploads/${file.filename}` 
        : undefined;
      return this.vehiculesService.create(dto, imageUrl);
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