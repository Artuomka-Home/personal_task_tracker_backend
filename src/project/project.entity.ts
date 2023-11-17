import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'project'})
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;
}
