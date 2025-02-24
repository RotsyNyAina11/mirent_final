import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { District } from "./district.entity";

@Entity()
export class Region {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal')
    price: number;

    @OneToMany(() => District, district => district.region)
    districts:  District[];
}

export default Region;