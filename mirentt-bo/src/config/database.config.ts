import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
<<<<<<< HEAD
import { BlacklistedToken } from 'src/entities/blacklisted-token.entity';
import { District } from 'src/entities/district.entity';
import { Region } from 'src/entities/region.entity';
import { Status } from 'src/entities/status.entity';
import { Type } from 'src/entities/type.entity';
import { User } from 'src/entities/user.entity';
import { Vehicule } from 'src/entities/vehicle.entity';
import { Client } from 'src/entities/client.entity';
=======
import { BlacklistedToken } from '../entities/blacklisted-token.entity';
import { District } from '../entities/district.entity';
import { Region } from '../entities/region.entity';
import { Status } from '../entities/status.entity';
import { Type } from '../entities/type.entity';
import { User } from '../entities/user.entity';
import { Vehicule } from '../entities/vehicle.entity';
>>>>>>> e10064f738306d88627bb90b2b81928b5461e5e1

dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    User,
    BlacklistedToken,
    Vehicule,
    Type,
    Status,
    Region,
    District,
    Client,
  ],
  synchronize: true,
};
