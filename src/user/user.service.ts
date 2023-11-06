import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { RegisterUserResponse } from './dto/register-user-response';
import { buildUserEntityResponse } from './utils/user-response-builder';
import { LoginDto } from './dto/login.dto';
import { comparePasswordHash } from '../helpers/password-hash';
import { decodeToken, getJwtToken } from '../helpers/jwt';
import { LoginResponse } from './dto/login-response';
import { errorMessages } from './constants/error-messages';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(user: AuthDto): Promise<RegisterUserResponse> {
    const { name, email } = user;
    const existingUser = await this.userRepository.findUserByNameOrEmail(name, email);
    if (existingUser) {
      if (existingUser.name === name) {
        throw new BadRequestException(errorMessages.DUPLICATE_NAME(name));
      } else {
        throw new BadRequestException(errorMessages.DUPLICATE_EMAIL(email));
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
    const password = user.password;
    const foundUser = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (!foundUser) {
      throw new HttpException(errorMessages.INVALID_LOGIN_CREDENTIALS, 403);
    }

    if (comparePasswordHash(password, foundUser.passwordHash)) {
      const token = getJwtToken(foundUser);
      try {
        const decodedToken = decodeToken(token);
        //check if the decoded token is an object and if it contains an exp field
        if (decodedToken && typeof decodedToken === 'object' && decodedToken.exp) {
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
