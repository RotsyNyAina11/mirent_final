import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devis } from '../entities/devis.entity';
import { DevisController } from './devis.controller';
import { DevisService } from './devis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Devis])], // <- entité Devis ici
  controllers: [DevisController], // <- controller
  providers: [DevisService], // <- service
  exports: [DevisService], // <- (facultatif) si utilisé ailleurs
})
export class DevisModule {}
