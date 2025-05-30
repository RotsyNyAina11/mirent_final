import { Controller, Get, Param } from '@nestjs/common';
import { PrixsService } from './prixs.service';

@Controller('prixs')
export class PrixsController {
  constructor(private readonly prixsService: PrixsService) {}

  @Get('count')
  getCount(): Promise<number> {
    return this.prixsService.getAvailableCountPrixs();
  }
  // prix.controller.ts
  @Get()
  findAll() {
    return this.prixsService.findAll(); // Assure-toi que ce service existe
  }

  @Get('region/:id')
  findByRegion(@Param('id') id: number) {
    return this.prixsService.findByRegion(id);
  }
}
