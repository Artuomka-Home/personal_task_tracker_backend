import BaseAbstractModel from './common/base.abstract.model';
import { PermissionEntity } from './permission.entity';
import { ProjectEntity } from './project.entity';
import { UserEntity } from './user.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'groups' })
export class GroupEntity extends BaseAbstractModel {
  @Column()
  title: string;

  @ManyToOne(() => ProjectEntity, (project) => project.groups)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ManyToMany(() => UserEntity, (user) => user.groups)
  users: UserEntity[];

  @ManyToMany(() => PermissionEntity, (permission) => permission.groups)
  permissions: PermissionEntity[];
}
