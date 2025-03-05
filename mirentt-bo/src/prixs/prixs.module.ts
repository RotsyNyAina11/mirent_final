import { Module } from '@nestjs/common';
import { PrixsService } from './prixs.service';
import { PrixsController } from './prixs.controller';

@Module({
  controllers: [PrixsController],
  providers: [PrixsService],
})
export class PrixsModule {}
