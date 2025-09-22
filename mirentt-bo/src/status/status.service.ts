import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'src/entities/status.entity';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto/create-status.dto';


@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async findAll(): Promise<Status[]> {
    return this.statusRepository.find();
  }

  async create(dto: CreateStatusDto): Promise<Status> {
    const status = this.statusRepository.create(dto);
    return this.statusRepository.save(status);
  }
}
