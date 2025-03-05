import { Controller } from '@nestjs/common';
import { PrixsService } from './prixs.service';

@Controller('prixs')
export class PrixsController {
  constructor(private readonly prixsService: PrixsService) {}
}
