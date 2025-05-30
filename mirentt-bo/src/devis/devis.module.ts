import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devis } from '../entities/devis.entity';
import { Client } from 'src/entities/client.entity'; // <-- ajouté
import { DevisController } from './devis.controller';
import { DevisService } from './devis.service';
import { ClientModule } from 'src/client/client.module';
import { Vehicule } from 'src/entities/vehicle.entity';
import { Region } from 'src/entities/region.entity';
import { Prix } from 'src/entities/prix.entity';
import { DevisItem } from 'src/entities/devis-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Devis,
      Client,
      Vehicule,
      Region,
      Prix,
      DevisItem,
    ]), // <-- ajouté Client
    ClientModule,
  ],
  controllers: [DevisController],
  providers: [DevisService],
  exports: [DevisService],
})
export class DevisModule {}
