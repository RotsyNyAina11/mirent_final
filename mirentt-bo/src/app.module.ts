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
import { MailerModule } from './mailer/mailer.module';
import { Vehicule } from './entities/vehicle.entity';
import { Region } from './entities/region.entity';
import { Status } from './entities/status.entity';
import { Type } from './entities/type.entity';
import { Prix } from './entities/prix.entity';
import { Client } from './entities/client.entity';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { Utilisateur } from './entities/utilisateur.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Notification } from './entities/notifications.entity';
import { District } from './entities/district.entity';
import { Reservation } from './entities/reservation.entity';
import { Facture } from './entities/facture.entity';
import { Paiement } from './entities/paiement.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationModule } from './reservation/reservation.module';
import { PaiementModule } from './paiement/paiement.module';
import { FactureModule } from './facturation/facturation.module';
import { User } from './auth/entities/user.entity';
import { BonDeCommandeModule } from './commande/commande.module';
import { BonDeCommande } from './entities/commande.entity';
import { PrixCarburantModule } from './prix-carburant/prix-carburant.module';
import { TypeCarburantModule } from './type-carburant/type-carburant.module';
import { TypeCarburant } from './entities/carburant.entity';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      entities: [
        Vehicule,
        Region,
        Status,
        Type,
        Prix,
        Client,
        User,
        Utilisateur,
        Notification,
        District,
        Reservation,
        Facture,
        Paiement,
        BonDeCommande,
        TypeCarburant
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
      serveStaticOptions: {
        setHeaders: (res) => {
          res.setHeader(
            'Access-Control-Allow-Origin',
            process.env.FRONTEND_URL || '*',
          );
          res.setHeader(
            'Access-Control-Allow-Methods',
            'GET,HEAD,PUT,PATCH,POST,DELETE',
          );
          res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization',
          );
        },
      },
    }),
    PrixsModule,
    MailerModule,
    UtilisateurModule,
    NotificationsModule,
    ReservationModule,
    PaiementModule,
    FactureModule,
    BonDeCommandeModule,
    PrixCarburantModule,
    TypeCarburantModule,
    TypeCarburantModule,
  ],
})
export class AppModule {}
