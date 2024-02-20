import { Type } from '../common/enums/type.enum';
import { AccessLevel } from '../common/enums/access-level.enum';
import BaseAbstractModel from './common/base.abstract.model';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { GroupEntity } from './group.entity';

@Entity({ name: 'permissions'})
export class PermissionEntity extends BaseAbstractModel {
  @Column({ type: 'enum', enum: AccessLevel, default: AccessLevel.NONE })
  accessLevel: AccessLevel;

  @Column({ type: 'enum', enum: Type })
  type: Type;

  @ManyToMany(() => GroupEntity, (group) => group.permissions)
  @JoinTable()
  groups: GroupEntity[];
}
