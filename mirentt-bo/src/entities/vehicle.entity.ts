import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./type.entity";
import { Status } from "./status.entity";

@Entity()
export class Vehicule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    nom: string;

    @Column({ nullable: false })
    marque: string;

    @Column({ nullable: false })
    modele: string;

    @Column({ nullable: false, unique: true })
    immatriculation: string;

    @Column()
    nombrePlace: number;

    @ManyToOne(() => Type, (type) => type.vehicules, { eager: true})
    type: Type;

    @ManyToOne(() => Status, (status) => status.vehicules, { eager: true })
    status: Status;

    @Column({ type: 'varchar', nullable: true })
    imageUrl: string | null;

}