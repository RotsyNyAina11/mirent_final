import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Proforma } from './proforma.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string | null;

  @OneToMany(() => Proforma, proforma => proforma.client)
  proformas: Proforma[];
}
