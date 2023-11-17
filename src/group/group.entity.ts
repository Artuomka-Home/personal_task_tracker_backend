import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'groups'})
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;
}
