import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/entities/client.entity';
import { CreateClientDto } from './createClient.dto';
import { UpdateClientDto } from './updateClient.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.clientRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const newClient = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(newClient);
  }

  async findOne(id: number): Promise<Client | null> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      return null;
    }
    return client;
  }
  async update(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<Client | null> {
    const client = await this.clientRepository.preload({
      id,
      ...updateClientDto,
    });

    if (!client) {
      return null;
    }

    return this.clientRepository.save(client);
  }
}
