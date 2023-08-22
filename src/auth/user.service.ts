import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserRepository } from './user.repisitory';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
         private readonly userRepository: UserRepository,
    ) {}

    async register(user: AuthDto): Promise<Omit<UserEntity, 'passwordHash'> > {
        const registeredUser = await this.userRepository.createAndSaveUser(user);
        const res = {
            id: registeredUser.id,
            name: registeredUser.name,
            email: registeredUser.email,
            created_at: registeredUser.created_at,
            updated_at: registeredUser.updated_at,
        }
        return res;
    }

    async login(user: AuthDto): Promise<{success: boolean}> {
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

    async find(dto: AuthDto): Promise<UserEntity[]> {
        return await this.userRepository.find(dto);
    }
}
