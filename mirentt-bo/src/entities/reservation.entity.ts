import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Region } from './region.entity';
import { Vehicule } from './vehicle.entity';
import { Prix } from './prix.entity';
import { ReservationStatus } from 'src/reservation/Enum/reservation-status.enum';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.UPCOMING,
  })
  status: ReservationStatus;

  @Column('decimal')
  totalPrice: number;

  @ManyToOne(() => Vehicule, (vehicle) => vehicle.reservations)
  vehicle: Vehicule;

  @Column()
  vehicleId: number;

  @ManyToOne(() => Region)
  pickupRegion: Region;

  @Column()
  pickupRegionId: number;
}
