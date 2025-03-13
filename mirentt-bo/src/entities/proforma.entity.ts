import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";
import { ProformaItem } from "./proformat-item.entity";

@Entity()
export class Proforma {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    proformaNumber: string;

    @Column({ type: 'text', nullable: true })
    contractReference: string;

    @Column()
    date: Date;

    @ManyToOne(() => Client, { eager: true })
    @JoinColumn({ name: 'clientId'})
    client: Client;

    @OneToMany(() => ProformaItem, (item) => item.proforma, { eager: true , cascade: true })
    items: ProformaItem[];

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ type: 'text', nullable: true })
    notes: string;


}