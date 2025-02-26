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
} from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from 'src/entities/client.entity';
import { CreateClientDto } from 'src/client/createClient.dto';
import { UpdateClientDto } from 'src/client/updateClient.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.create(createClientDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    const updatedClient = await this.clientService.update(id, updateClientDto);
    if (!updatedClient) {
      throw new NotFoundException(`Client avec ID ${id} introuvable`);
    }
    return updatedClient;
  }

  @Post()
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
