import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export default abstract class BaseAbstractModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
