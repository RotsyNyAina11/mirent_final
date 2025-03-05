import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import Region from './region.entity';
import District from './district.entity';


@Entity()
export class Prix{
    @PrimaryGeneratedColumn()
    prix_id: number;
  
    @ManyToOne(() => Region, (region) => region.prix)
    @JoinColumn({ name: 'region_id' })
    region: Region;
  
    @Column()
    region_id: number;
  
    @Column()
    prix_location: number;
}
