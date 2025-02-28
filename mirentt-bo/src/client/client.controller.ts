import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from 'src/entities/client.entity';
import { CreateClientDto } from 'src/client/createClient.dto';
import { UpdateClientDto } from 'src/client/updateClient.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('client-count')
  async getClientCount(): Promise<number> {
    return this.clientService.getClientCount();
  }

  @Get()
  async findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateClientDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<Client | null> {
    try {
      const logo: string | undefined = file
        ? `http://localhost:3000/uploads/${file.filename}`
        : undefined;
      const updateClient = await this.clientService.update(id, dto, logo);
      return updateClient;
    } catch (error) {
      console.error('Error during filr upload or update:', error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateClientDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Client> {
    const logo: string | undefined = file
      ? `http://localhost:3000/uploads/${file.filename}`
      : undefined;
    return this.clientService.create(dto, logo);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const deleted = await this.clientService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Client avec ID ${id} introuvable`);
    }
    return { message: 'Client supprimé avec succès' };
  }
}
