import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TypeModule } from './type/type.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    VehiclesModule,
    TypeModule
  ],
})
export class AppModule {}
