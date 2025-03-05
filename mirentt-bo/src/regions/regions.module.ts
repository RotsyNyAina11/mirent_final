import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import District from 'src/entities/district.entity';
import Region from 'src/entities/region.entity';
import { Prix } from 'src/entities/prix.entity';

@Module({
      imports: [
          TypeOrmModule.forFeature([District, Region, Prix]),
          RegionsModule
      ],
      controllers: [RegionsController],
      providers: [RegionsService],
})
export class RegionsModule {}
