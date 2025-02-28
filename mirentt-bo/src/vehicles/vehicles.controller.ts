import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicule } from 'src/entities/vehicle.entity';
import { CreateVehiculeDto } from './createVehicule.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateVehiculeDto } from './updateVehicule.dto';



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
    @UseInterceptors(FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        }
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimetypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedMimetypes.includes(file.mimetype)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }
        callback(null, true);
      } 
    }))
    async update(
      @Param('id') id: number,
      @Body() dto: UpdateVehiculeDto,
      @UploadedFile() file: Express.Multer.File | undefined
    ): Promise<Vehicule | null> {
      try {
        const imageUrl: string | undefined = file
          ? `http://localhost:3000/uploads/${file.filename}`
          : undefined;
    
        const updatedVehicule = await this.vehiculesService.update(id, dto, imageUrl);
    
        return updatedVehicule;
      } catch (error) {
        console.error('Error during file upload or update:', error);
        throw new InternalServerErrorException('Internal server error');
      }
    }
    
    
    

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.vehiculesService.remove(id);
  }
}