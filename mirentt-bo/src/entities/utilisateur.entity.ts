import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Utilisateur {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  passwordHash: string;
}
