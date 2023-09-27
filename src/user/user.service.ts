import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { RegisterUserResponse } from './dto/register-user-response';
import { buildUserEntityResponse } from './utils/user-response-builder';
import { LoginDto } from './dto/login.dto';
import { comparePasswordHash, getPasswordHash } from 'src/helpers/password-hesh';
import { decodeToken, getJwtToken } from 'src/helpers/jwt';
import { LoginResponse } from './dto/login-response';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(user: AuthDto): Promise<RegisterUserResponse> {
    const { name, email } = user;
    const existingUser = await this.userRepository.findUserByNameOrEmail(name, email);
    if (existingUser) {
      if (existingUser.name === name) {
        throw new BadRequestException(`User name: ${name} already exists`);
      } else {
        throw new BadRequestException(`User email: ${email} already exists`);
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
      throw new Error('User not found');
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
          throw new Error('Invalid token format');
        }
      } catch (error) {
        throw new Error('Error decoding token');
      }
    }

    throw new Error('Password is incorrect');
  }

  async getUser(id: string): Promise<RegisterUserResponse> {
    const foundUser = await this.userRepository.findOneBy({ id });
    if (!foundUser) {
      throw new Error('User not found');
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
