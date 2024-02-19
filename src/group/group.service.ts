import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GroupEntity } from '../entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}
  async createGroup(dto: CreateGroupDto): Promise<GroupEntity> {
    const group = await this.groupRepository.createGroup(dto);
    return group;
  }
}
