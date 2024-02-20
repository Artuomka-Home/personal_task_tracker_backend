import { Injectable } from '@nestjs/common';
import { GroupEntity } from '../entities/group.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { ProjectEntity } from '../entities/project.entity';

@Injectable()
export class GroupRepository extends Repository<GroupEntity> {
  constructor(dataSource: DataSource) {
    super(GroupEntity, dataSource.createEntityManager());
  }

  async createGroup(dto: CreateGroupDto, project: ProjectEntity): Promise<GroupEntity> {
    const { title } = dto;
    try {
      const createdGroup = this.create({
        title,
        project: project,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return await this.save(createdGroup);
    } catch (error) {
      throw new Error(error);
    }
  }
}
