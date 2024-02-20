import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';
import { ProjectRepository } from 'src/project/project.repository';

@Module({
  controllers: [GroupController],
  providers: [GroupService, GroupRepository, ProjectRepository]
})
export class GroupModule {}
