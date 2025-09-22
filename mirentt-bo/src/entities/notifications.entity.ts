import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) // Si la notification est pour un admin spécifique, sinon null pour tous
  userId: number;

  @Column()
  type: string; // ex: 'new_vehicle', 'price_update'

  @Column()
  message: string; // Le message affiché à l'admin

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'jsonb', nullable: true }) // Pour stocker des données structurées (ex: { vehicleId: 123 })
  payload: any;

  @CreateDateColumn()
  createdAt: Date;
}
