import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { DevisService } from './devis.service';
import { CreateDevisItemDto } from './create-devis.dto';
import { UpdateDevisDto } from './update-devis.dto';
import { Devis } from 'src/entities/devis.entity';

@Controller('devis')
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Post()
  async create(@Body() createDevisDto: CreateDevisItemDto): Promise<Devis> {
    return this.devisService.create(createDevisDto);
  }

  @Get()
  async findAll(): Promise<Devis[]> {
    return this.devisService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Devis> {
    return this.devisService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDevisDto: UpdateDevisDto,
  ): Promise<Devis> {
    return this.devisService.update(id, updateDevisDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.devisService.remove(id);
  }
}
