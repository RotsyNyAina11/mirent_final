import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./region.entity";
import { Prix } from "./prix.entity";

@Entity()
export class District{
    @PrimaryGeneratedColumn()
    district_id: number;
  
    @Column()
    nom_district: string;
}

export default District;