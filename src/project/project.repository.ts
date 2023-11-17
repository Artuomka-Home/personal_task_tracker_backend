import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { ProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
  constructor(dataSource: DataSource) {
    super(ProjectEntity, dataSource.createEntityManager());
  }

  async createProject(dto: ProjectDto): Promise<ProjectEntity> {
    const createdProject = this.create({
      title: dto.title,
      description: dto.description,
    });

    return this.save(createdProject);
  }
}
