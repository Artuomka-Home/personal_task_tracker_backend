import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from './user.entity';
import { FindUserDto } from './dto/find-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isStrongPass } from 'src/helpers/validator';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Register user' })
    @ApiResponse({ status: 201, type: UserEntity })
    async register(@Body() dto: AuthDto): Promise<Omit<UserEntity, 'passwordHash'> > {
        isStrongPass(dto.password);
        return await this.userService.register(dto);
    }

    @HttpCode(200)
    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200 })
    async login(@Body() dto: AuthDto): Promise<{success: boolean}> {
        return await this.userService.login(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200, type: UserEntity })
    async getUser(@Param('id') id: string): Promise<UserEntity> {
        return await this.userService.getUser(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by id' })
    @ApiResponse({ status: 200 })
    async deleteUser(@Param('id') id: string): Promise<UserEntity> {
        return await this.userService.deleteUser(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update user by id' })
    @ApiResponse({ status: 200, type: UserEntity })
    async updateUser(@Param('id') id: string, @Body() dto: AuthDto): Promise<UserEntity> {
        return await this.userService.updateUser(id, dto);
    }

    // @UsePipes( new ValidationPipe())
    @HttpCode(200)
    @Post() // find user by filter
    @ApiOperation({ summary: 'Find user by filter' })
    @ApiResponse({ status: 200, type: [UserEntity] })
    async find(@Body() dto: FindUserDto){}
}
