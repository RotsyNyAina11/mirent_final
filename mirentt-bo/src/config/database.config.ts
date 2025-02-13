import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { BlacklistedToken } from 'src/entities/blacklisted-token.entity';
import { User } from 'src/entities/user.entity';
import { Vehicle } from 'src/entities/vehicle.entity';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, BlacklistedToken, Vehicle],
  synchronize: true,
};
