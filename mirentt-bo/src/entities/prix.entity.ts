import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Region } from './region.entity';

@Entity()
export class Prix {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  @OneToOne(() => Region, { onDelete: 'CASCADE' })
  @JoinColumn()
  region: Region;
}