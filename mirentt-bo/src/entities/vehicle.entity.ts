import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    nom: string;

    @Column({ nullable: false })
    marque: string;

    @Column({ nullable: false })
    modele: string;

    @Column({ nullable: false })
    type: string;

    @Column({ nullable: false, unique: true })
    immatriculation: string;

    @Column({ nullable: false, type:'int'})
    nombrePlace: number;

    @Column({ type: 'varchar', nullable: false, default: 'disponible' })
    status: string;

}