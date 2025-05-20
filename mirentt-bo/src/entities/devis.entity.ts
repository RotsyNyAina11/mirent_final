import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { User } from './user.entity';
import { DevisItem } from './devis-item.entity';
import { Prix } from './prix.entity';
@Entity()
export class Devis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateCreation: Date;

  @Column({ unique: true })
  numeroDevis: string;

  @ManyToOne(() => Client, (client) => client.devis, { nullable: true })
  client: Client;

  @OneToMany(() => DevisItem, (item) => item.devis, { cascade: true })
  items: DevisItem[];

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  prixCarburant: number;

  @Column('decimal', { precision: 10, scale: 2 })
  prixTotal: number;

  @Column({ nullable: true })
  totalEnLettre: string;

  @Column({ nullable: true })
  signatureClient: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
