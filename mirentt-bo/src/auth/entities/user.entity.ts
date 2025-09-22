import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type UserRole = 'admin' | 'manager' | 'employee';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['admin', 'manager', 'employee'], default: 'employee' })
    role: UserRole;
}
