import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vehicule } from './vehicle.entity';
import { Devis } from './devis.entity';
import { Region } from './region.entity';
import { Prix } from './prix.entity';

@Entity()
export class DevisItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Devis, (devis) => devis.items)
  @JoinColumn({ name: 'devisId' })
  devis: Devis;

  @ManyToOne(() => Vehicule, { eager: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicule: Vehicule;

  @ManyToOne(() => Region, { eager: true })
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @ManyToOne(() => Prix, { eager: true })
  @JoinColumn({ name: 'prixId' })
  prix: Prix;

  @Column()
  dateDebut: Date;

  @Column()
  dateFin: Date;

  @Column()
  nombreJours: number;

  @Column({ type: 'decimal' })
  prixUnitaire: number;

  @Column()
  prixCarburant: number;

  @Column({ type: 'decimal' })
  sousTotal: number;
}
