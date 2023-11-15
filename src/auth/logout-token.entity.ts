import { UserEntity } from '../user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LogoutTokenEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.tokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
