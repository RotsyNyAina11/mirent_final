import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proforma } from 'src/entities/proforma.entity';
import { ProformaItem } from 'src/entities/proformat-item.entity';
import { ProformaService } from './proforma.service';
import { ProformaController } from './proforma.controller';
import { Vehicule } from 'src/entities/vehicle.entity';
import { Region } from 'src/entities/region.entity';
import { Prix } from 'src/entities/prix.entity';
import { Status } from 'src/entities/status.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Proforma, ProformaItem, Vehicule, Region, Prix, Status])],
    providers: [ProformaService],
    controllers: [ProformaController],
})
export class ProformaModule {}
