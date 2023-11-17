import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { ProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './project.entity';

@ApiBearerAuth()
@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create project' })
  @ApiResponse({ status: 200, type: ProjectEntity })
  async createProject(@Body() dto: ProjectDto): Promise<ProjectEntity> {
    return await this.projectService.createProject(dto);
  }
}
