import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { GroupEntity } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@ApiBearerAuth()
@ApiTags('group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create group' })
  @ApiResponse({ status: 200 })
  async createGroup(@Body() dto: CreateGroupDto): Promise<GroupEntity> {
    return await this.groupService.createGroup(dto);
  }
}
