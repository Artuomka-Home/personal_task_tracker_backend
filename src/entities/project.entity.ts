import { GroupEntity } from './group.entity';
import BaseAbstractModel from './common/base.abstract.model';
import { TaskEntity } from './task.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseAbstractModel {
  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => GroupEntity, (group) => group.project)
  groups: GroupEntity[];

  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];
}
