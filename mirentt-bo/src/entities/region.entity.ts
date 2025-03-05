import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { District } from "./district.entity";
import { Prix } from "./prix.entity";

@Entity()
export class Region {
    @PrimaryGeneratedColumn()
    region_id: number;

    @Column()
    nom_region: string;


    @OneToOne(() => District, { nullable: true })
    @JoinColumn({ name: 'district_id' })
    district: District;

    @Column({ nullable: true })
    district_id: number | null;
  
    @OneToMany(() => Prix, (prix) => prix.region)
    prix: Prix[];
}

export default Region;