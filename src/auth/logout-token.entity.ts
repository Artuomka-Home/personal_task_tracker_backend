import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LogoutTokenEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  user: UserEntity;
}
