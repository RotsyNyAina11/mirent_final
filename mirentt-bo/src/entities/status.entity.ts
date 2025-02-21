import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Vehicule } from "./vehicle.entity";

@Entity()
export class Status {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    status: string;

    @OneToMany(() => Vehicule, (vehicule) => vehicule.type)
    vehicules: Vehicule[];
}