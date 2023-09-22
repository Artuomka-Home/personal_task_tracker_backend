import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { RegisterUserResponse } from './dto/register-user-response';
import { buildUserEntityResponse } from './utils/user-response-builder';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(user: AuthDto): Promise<RegisterUserResponse> {
    const foundUsers = await this.userRepository.find({
      where: {
        name: user.name,
        email: user.email,
      },
    });
    if (foundUsers.length > 0) {
      throw new BadRequestException('User already exists');
    }
    const registeredUser = await this.userRepository.createAndSaveUser(user);
    return buildUserEntityResponse(registeredUser);
  }

  async login(user: AuthDto): Promise<{ success: boolean }> {
    return await this.userRepository.login(user);
  }

  async getUser(id: string): Promise<UserEntity> {
    return await this.userRepository.getUser(id);
  }

  async deleteUser(id: string): Promise<UserEntity> {
    return await this.userRepository.deleteUser(id);
  }

  async updateUser(id: string, dto: AuthDto): Promise<UserEntity> {
    return await this.userRepository.updateUser(id, dto);
  }
}
