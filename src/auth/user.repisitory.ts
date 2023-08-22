import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthDto } from './dto/auth.dto';
import { comparePasswordHash, getPasswordHash } from 'src/helpers/password-hesh';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
         private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createAndSaveUser(user: AuthDto): Promise<UserEntity> {
        const password = user.password;
        const passwordHash = await getPasswordHash(password);

        const foundUsers = await this.userRepository.find(
           { where: {
                name: user.name,
                email: user.email,
            }
        });

        for (const foundUser of foundUsers) {
            const res = await comparePasswordHash(password, foundUser.passwordHash);
            if (res) {
                throw new BadRequestException('User already exists');
            }
        }     
        
        const createdUser: Omit<UserEntity, 'id'> = this.userRepository.create({
            name: user.name,
            email: user.email,
            passwordHash,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return this.userRepository.save(createdUser);
    }

    async login(user: AuthDto): Promise<{success: boolean}> {
        const password = user.password;
        const passwordHash = await getPasswordHash(password);

        const foundUser = await this.userRepository.findOne({
            where: {
                name: user.name,
                email: user.email,
                passwordHash,
            }
        });

        if (!foundUser) {
            throw new Error('User not found');
        }

        return {success: true};
    }

    async getUser(id: string): Promise<UserEntity> {
        const foundUser = await this.userRepository.findOneBy({id});

        if (!foundUser) {
            throw new Error('User not found');
        }

        return foundUser;
    }

    async deleteUser(id: string): Promise<UserEntity> {
        const foundUser = await this.userRepository.findOneBy({id});

        if (!foundUser) {
            throw new Error('User not found');
        }

        return this.userRepository.remove(foundUser);
    }

    async updateUser(id: string, dto: AuthDto): Promise<UserEntity> {
        const foundUser: UserEntity = await this.userRepository.findOneBy({id});

        if (!foundUser) {
            throw new Error('User not found');
        }

        foundUser.name = dto.name;
        foundUser.email = dto.email;
        if (dto.password){
             foundUser.passwordHash = await getPasswordHash(dto.password);
        }
        foundUser.updated_at = new Date();

        return this.userRepository.save(foundUser);
    }

    async find(dto: AuthDto): Promise<UserEntity[]> {
        return await this.userRepository.findBy(dto);
    }
}
