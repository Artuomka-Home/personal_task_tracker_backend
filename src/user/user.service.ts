import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { RegisterUserResponse } from './dto/register-user-response';
import { buildUserEntityResponse } from './utils/user-response-builder';
import { LoginDto } from './dto/login.dto';
import { comparePasswordHash } from '../helpers/password-hash';
import { decodeToken, getJwtToken } from '../helpers/jwt';
import { LoginResponse } from './dto/login-response';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(user: AuthDto): Promise<RegisterUserResponse> {
    const { name, email } = user;
    const existingUser = await this.userRepository.findUserByNameOrEmail(name, email);
    if (existingUser) {
      if (existingUser.name === name) {
        throw new BadRequestException(`User name ${name} already exists`);
      } else {
        throw new BadRequestException(`User email ${email} already exists`);
      }
    }

    try {
      const registeredUser = await this.userRepository.createAndSaveUser(user);
      if (registeredUser) {
        return buildUserEntityResponse(registeredUser);
      }
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async login(user: LoginDto): Promise<LoginResponse> {
    const { email, password } = user;
    let foundUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const { id, passwordHash } = foundUser;
    if (comparePasswordHash(password, passwordHash)) {
      const token = getJwtToken(foundUser);
      try {
        const decodedToken = decodeToken(token);
        if (decodedToken && typeof decodedToken === 'object' && decodedToken.exp) {
          foundUser = await this.userRepository.updateUserToken(id, token);
          const expirationDate = new Date(decodedToken.exp * 1000); // Convert the UNIX timestamp to a JavaScript Date object
          return { token: token, exp: expirationDate };
        } else {
          throw new BadRequestException('Invalid token format');
        }
      } catch (error) {
        throw new Error('Error decoding token');
      }
    }

    throw new BadRequestException('Invalid email or password');
  }

  async logout(id: string): Promise<boolean> {
    const user = await this.userRepository.updateUserToken(id, '');
    const { token } = user;
    if (token) {
      throw new BadRequestException('Error logging out');
    }
    return true;
  }

  async getUser(id: string): Promise<RegisterUserResponse> {
    const foundUser = await this.userRepository.findOneBy({ id });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return buildUserEntityResponse(foundUser);
  }

  async deleteUser(id: string): Promise<UserEntity> {
    return await this.userRepository.deleteUser(id);
  }

  async updateUser(id: string, dto: AuthDto): Promise<UserEntity> {
    return await this.userRepository.updateUser(id, dto);
  }
}
