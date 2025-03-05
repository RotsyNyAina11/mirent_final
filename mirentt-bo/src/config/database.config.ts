import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { BlacklistedToken } from '../entities/blacklisted-token.entity';
import { District } from '../entities/district.entity';
import { Region } from '../entities/region.entity';
import { Status } from '../entities/status.entity';
import { Type } from '../entities/type.entity';
import { User } from '../entities/user.entity';
import { Vehicule } from '../entities/vehicle.entity';
import { Prix } from 'src/entities/prix.entity';

dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, BlacklistedToken, Vehicule, Type, Status, Region, District, Prix],
  synchronize: true,
};
