import { LogoutTokenEntity } from '../auth/logout-token.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @OneToMany(() => LogoutTokenEntity, (token) => token.user, {
    cascade: true,
  })
  tokens: LogoutTokenEntity[];
}
