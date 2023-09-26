import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
    @ApiProperty({ example: 'exampleName' })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    name: string;

    @ApiProperty( { example: 'exampleEmail@gmail.com' })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'example@Password1' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}