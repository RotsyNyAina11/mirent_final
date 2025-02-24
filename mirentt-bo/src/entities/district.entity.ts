import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./region.entity";

@Entity()
export class District{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', {nullable: true})
    price?: number;

    @ManyToOne(() => Region, region => region.districts)
    region: Region;
}

export default District;