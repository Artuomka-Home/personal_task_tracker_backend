import { Injectable } from '@nestjs/common';
import { GroupEntity } from '../entities/group.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupRepository extends Repository<GroupEntity> {
  constructor(dataSource: DataSource) {
    super(GroupEntity, dataSource.createEntityManager());
  }

  async createGroup(dto: CreateGroupDto): Promise<GroupEntity> {
    try {
      const createdGroup = this.create({
        title: dto.title,
        created_at: new Date(),
        updated_at: new Date(),
      });
      const res = await this.save(createdGroup);
      return res;
    } catch (error) {
      console.log('Error ===>', error.message);
      throw new Error(error);
    }
  }
}
