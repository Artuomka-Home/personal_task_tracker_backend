import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthDto } from './dto/auth.dto';
import { getPasswordHash } from '../helpers/password-hash';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createAndSaveUser(user: AuthDto): Promise<UserEntity> {
    const password = user.password;
    const passwordHash = await getPasswordHash(password);

    const createdUser: Omit<UserEntity, 'id'> = this.create({
      name: user.name,
      email: user.email,
      passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this.save(createdUser);
  }

  async deleteUser(id: string): Promise<UserEntity> {
    const foundUser = await this.findOneBy({ id });

    if (!foundUser) {
      throw new Error('User not found');
    }

    return this.remove(foundUser);
  }

  async updateUser(id: string, dto: AuthDto): Promise<UserEntity> {
    const foundUser: UserEntity = await this.findOneBy({ id });

    if (!foundUser) {
      throw new Error('User not found');
    }

    foundUser.name = dto.name;
    foundUser.email = dto.email;
    if (dto.password) {
      foundUser.passwordHash = await getPasswordHash(dto.password);
    }
    foundUser.updated_at = new Date();

    return this.save(foundUser);
  }

  async findUserByNameOrEmail(name: string, email: string): Promise<UserEntity> {
    const existingUser = await this.createQueryBuilder('user')
      .where('user.name = :name OR user.email = :email', { name, email })
      .getOne();
    return existingUser;
  }
}
