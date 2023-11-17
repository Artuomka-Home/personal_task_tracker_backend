import { Injectable } from '@nestjs/common';
import { GroupEntity } from './group.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupRepository extends Repository<GroupEntity> {
  constructor(dataSource: DataSource) {
    super(GroupEntity, dataSource.createEntityManager());
  }

  async createGroup(dto: CreateGroupDto): Promise<GroupEntity> {
    const createdGroup = this.create({
      title: dto.title,
    });

    return this.save(createdGroup);
  }
}
