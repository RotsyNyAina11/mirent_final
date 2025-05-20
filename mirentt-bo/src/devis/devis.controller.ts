import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DevisService } from './devis.service';
import { CreateDevisDto } from './create-devis.dto';
import { UpdateDevisDto } from './update-devis.dto';

@Controller('devis')
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  // Créer un nouveau devis
  @Post()
  create(@Body() createDevisDto: CreateDevisDto) {
    return this.devisService.create(createDevisDto);
  }

  // Récupérer tous les devis
  @Get()
  findAll() {
    return this.devisService.findAll();
  }

  // Récupérer un seul devis par ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devisService.findOne(+id);
  }

  // Mettre à jour un devis
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevisDto: UpdateDevisDto) {
    return this.devisService.update(+id, updateDevisDto);
  }

  // Supprimer un devis
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devisService.remove(+id);
  }
}
