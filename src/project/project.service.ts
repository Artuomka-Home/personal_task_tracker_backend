import { Injectable } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { ProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

    async createProject(dto: ProjectDto): Promise<ProjectEntity>{
        return await this.projectRepository.createProject(dto);
    }
}
