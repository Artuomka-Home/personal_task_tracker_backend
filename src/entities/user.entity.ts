import BaseAbstractModel from './common/base.abstract.model';
import { LogoutTokenEntity } from './logout-token.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { GroupEntity } from './group.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseAbstractModel {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @OneToMany(() => LogoutTokenEntity, (token) => token.user, {
    cascade: true,
  })
  tokens: LogoutTokenEntity[];

  @ManyToMany(() => GroupEntity, (group) => group.users)
  @JoinTable()
  groups: GroupEntity[];
}
