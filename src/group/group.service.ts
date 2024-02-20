import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GroupEntity } from '../entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { ProjectRepository } from 'src/project/project.repository';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}
  async createGroup(dto: CreateGroupDto): Promise<GroupEntity> {
    const { projectId } = dto;
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    return await this.groupRepository.createGroup(dto, project);
  }
}
