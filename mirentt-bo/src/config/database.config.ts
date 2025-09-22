import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

import { BlacklistedToken } from '../entities/blacklisted-token.entity';
import { Region } from '../entities/region.entity';
import { Status } from '../entities/status.entity';
import { Type } from '../entities/type.entity';
import { Vehicule } from '../entities/vehicle.entity';

import { Prix } from 'src/entities/prix.entity';
import { Client } from '../entities/client.entity';
import { User } from 'src/auth/entities/user.entity';
import { Utilisateur } from 'src/entities/utilisateur.entity';
import { Notification } from 'src/entities/notifications.entity';
import { District } from '../entities/district.entity';
import { Reservation } from '../entities/reservation.entity';
import { Facture } from '../entities/facture.entity';
import { Paiement } from '../entities/paiement.entity';

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
    Client,
    Prix,
    Utilisateur,
    Notification,
    District,
    Reservation,
    Facture,
    Paiement,
  ],

  synchronize: true,
};
