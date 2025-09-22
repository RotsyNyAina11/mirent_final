import { Body, Controller, Get, Post } from '@nestjs/common';
import { StatusService } from './status.service';
import { Status } from 'src/entities/status.entity';
import { CreateStatusDto } from './dto/create-status.dto';


@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  async findAll(): Promise<Status[]> {
    return this.statusService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateStatusDto): Promise<Status> {
    return this.statusService.create(dto);
  }
}
