import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DevisService } from './devis.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateDevisDto } from './dto/update-devis.dto';
import { Devis } from 'src/entities/devis.entity';

@Controller('devis') 
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createDevisDto: CreateDevisDto) {
    return this.devisService.create(createDevisDto);
  }

  @Get()
  findAll(): Promise<Devis[]> {
    return this.devisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devisService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevisDto: UpdateDevisDto) {
    return this.devisService.update(id, updateDevisDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string) {
    return this.devisService.remove(id);
  }
}
