import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'exampleTitle' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  title: string;
}
