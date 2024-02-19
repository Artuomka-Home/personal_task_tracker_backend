import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from '../entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isStrongPass } from '../common/helpers/validator';
import { RegisterUserResponse } from './dto/register-user-response';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login-response';
import { AuthGuard } from '../auth/auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';
import { SuccessResponse } from './dto/success-response.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 201, type: RegisterUserResponse })
  async register(@Body() dto: AuthDto): Promise<RegisterUserResponse> {
    isStrongPass(dto.password);
    return await this.userService.register(dto);
  }

  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: LoginResponse })
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return await this.userService.login(dto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('logout:id')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  async logout(@Req() request: Request, @Param('id') id: string): Promise<SuccessResponse> {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    const accessToken = type === 'Bearer' ? token : undefined;
    const res = await this.userService.logout(id, accessToken);
    return { success: res };
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: RegisterUserResponse })
  async getUser(@UserId() id: string): Promise<RegisterUserResponse> {
    return await this.userService.getUser(id);
  }

  @UseGuards(AuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  async deleteUser(@UserId() id: string): Promise<SuccessResponse> {
    const res = await this.userService.deleteUser(id);
    return { success: res };
  }

  @UseGuards(AuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, type: UserEntity })
  async updateUser(@UserId() id: string, @Body() dto: AuthDto): Promise<UserEntity> {
    return await this.userService.updateUser(id, dto);
  }
}
