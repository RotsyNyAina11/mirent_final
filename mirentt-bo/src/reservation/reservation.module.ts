import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from '../entities/reservation.entity';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { RegionsModule } from '../regions/regions.module';
import { PrixsModule } from 'src/prixs/prixs.module';
import { StatusModule } from 'src/status/status.module';
import { Status } from 'src/entities/status.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Status]),
    VehiclesModule,
    RegionsModule,
    PrixsModule,
    StatusModule,
    NotificationsModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
