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



@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
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
    MailerModule
  ],
})
export class AppModule {}
