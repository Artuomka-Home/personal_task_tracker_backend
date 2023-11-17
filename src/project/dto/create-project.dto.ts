import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ProjectDto {
    @ApiProperty({ example: 'Project title' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: 'Project description' })
    @IsNotEmpty()
    @IsString()
    description: string;
}