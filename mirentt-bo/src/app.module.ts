import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TypeModule } from './type/type.module';
import { StatusModule } from './status/status.module';

import { RegionsModule } from './regions/regions.module';
import { PrixsModule } from './prixs/prixs.module';
import { ClientModule } from './client/client.module';
import { ProformaModule } from './proforma/proforma.module';
import { MailerModule } from './mailer/mailer.module';
import { DevisModule } from './devis/devis.module';
import { ReservationModule } from './reservation/reservation.module';
import { Reservation } from './entities/reservation.entity';
import { Vehicule } from './entities/vehicle.entity';
import { Region } from './entities/region.entity';
import { Status } from './entities/status.entity';
import { Type } from './entities/type.entity';
import { Prix } from './entities/prix.entity';
import { Client } from './entities/client.entity';
import { Proforma } from './entities/proforma.entity';
import { Devis } from './entities/devis.entity';
import { ProformaItem } from './entities/proformat-item.entity';
import { UtilisateurController } from './utilisateur/utilisateur.controller';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { Utilisateur } from './entities/utilisateur.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Notification } from './entities/notifications.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      entities: [
        Reservation,
        Vehicule,
        Region,
        Status,
        Type,
        Prix,
        Client,
        Proforma,
        ProformaItem,
        Devis,
        Utilisateur,
        Notification,
      ],
    }),
    AuthModule,
    VehiclesModule,
    TypeModule,
    StatusModule,
    RegionsModule,
    ClientModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    RegionsModule,
    PrixsModule,
    ProformaModule,
    MailerModule,
    DevisModule,
    ReservationModule,
    UtilisateurModule,
    NotificationsModule,
  ],
  controllers: [UtilisateurController],
})
export class AppModule {}
