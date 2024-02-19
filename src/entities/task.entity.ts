import BaseAbstractModel from './common/base.abstract.model';
import { ProjectEntity } from './project.entity';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'task' })
export class TaskEntity extends BaseAbstractModel {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column('varchar', { array: true, default: [] })
  attachments: string[];

  @Column({ type: 'date', name: 'estimation_date' })
  estimationDate: Date;

  @Column('varchar', { name: 'current_assigners', array: true })
  currentAssigners: string[];

  @ManyToOne(() => ProjectEntity, (project) => project.tasks)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
