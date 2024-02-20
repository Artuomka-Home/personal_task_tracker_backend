import { IsArray, IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'exampleName' })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    name: string;

    @ApiProperty( { example: 'exampleEmail@gmail.com' })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'example@Password1' })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;

    @ApiProperty()
    @IsArray()
    groups: string[];
}