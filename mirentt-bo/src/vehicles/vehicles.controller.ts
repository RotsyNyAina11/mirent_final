import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Logger, NotFoundException, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicule } from 'src/entities/vehicle.entity';
import { CreateVehiculeDto } from './createVehicule.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateVehiculeDto } from './updateVehicule.dto';



@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiculesService: VehiclesService
    ) {}
    private readonly logger = new Logger(VehiclesController.name);


  @Get('available-count')
  async getAvailableVehiclesCount(): Promise<number> {
    return this.vehiculesService.getAvailableVehiculeCount();
  }
  @Get()
  findAll(): Promise<Vehicule[]> {
    return this.vehiculesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Vehicule | null> {
      const vehicle = await this.vehiculesService.findOne(id);
      if (!vehicle) {
          throw new NotFoundException(`Vehicle with ID ${id} not found`);
      }
      return vehicle;
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
      console.log('Fichier reçu :', file);
      const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
      const imageUrl = `${baseUrl}/uploads/${file.filename}`;
        console.log('imageUrl:', imageUrl);
      return this.vehiculesService.create(dto, imageUrl);
    }
  

    @Put(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
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
      this.logger.log(`Requête PUT reçue pour le véhicule avec ID : ${id}`);
      this.logger.log('Corps de la requête (DTO) : ', JSON.stringify(dto));
      this.logger.log('Fichier de la requête (File) : ', JSON.stringify(file));
      try {
        const imageUrl: string | undefined = file
          ? `http://localhost:3000/uploads/${file.filename}`
          : undefined;
        this.logger.log('URL de l\'image : ', imageUrl);
    
        const updatedVehicule = await this.vehiculesService.update(id, dto, imageUrl);

        this.logger.log('Véhicule mis à jour : ', JSON.stringify(updatedVehicule));
    
        return updatedVehicule;
      } catch (error) {
        this.logger.error(`Erreur lors de la mise à jour du véhicule avec ID ${id} : `, error.stack);
        throw new InternalServerErrorException('Internal server error');
      }
    }
    
    
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        try {
            await this.vehiculesService.remove(id);
        } catch (error) {
            throw new NotFoundException(`Vehicle with ID ${id} not found`);
        }
    }
}