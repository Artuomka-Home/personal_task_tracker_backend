import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'exampleTitle' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}
