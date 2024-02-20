import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { getPasswordHash } from '../common/helpers/password-hash';
import { UpdateUserDto } from './dto/update-user.dto';
import { GroupEntity } from '../entities/group.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createAndSaveUser(user: AuthDto): Promise<UserEntity> {
    const password = user.password;
    const passwordHash = await getPasswordHash(password);

    const createdUser = this.create({
      name: user.name,
      email: user.email,
      passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this.save(createdUser);
  }

  async updateUser(user: UserEntity, dto: UpdateUserDto, existingGroups?: GroupEntity[]): Promise<UserEntity> {
    const { name, email, password } = dto;
    if (dto) {
      user.name = name;
      user.email = email;
      if (password) {
        user.passwordHash = await getPasswordHash(password);
      }
      if (existingGroups){
        user.groups = existingGroups;
      }
      user.updated_at = new Date();
    }
    return this.save(user);
  }

  async findUserByNameOrEmail(name: string, email: string): Promise<UserEntity> {
    const existingUser = await this.createQueryBuilder('user')
      .where('user.name = :name OR user.email = :email', { name, email })
      .getOne();
    return existingUser;
  }
}
