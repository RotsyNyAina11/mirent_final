import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Prix } from './prix.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom_region: string;

  @Column({ nullable: true })
  nom_district?: string;
  @OneToOne(() => Prix, (prix) => prix.region, { eager: false })
  prix: Prix;

  @OneToMany(() => Reservation, (reservation) => reservation.pickupRegion)
  reservations: Reservation[];
}
