import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LogoutTokenEntity } from './logout-token.entity';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class LogoutTokenRepository extends Repository<LogoutTokenEntity> {
  constructor(
    dataSource: DataSource,
    private readonly userRepository: UserRepository,
  ) {
    super(LogoutTokenEntity, dataSource.createEntityManager());
  }

  async saveLogoutToken(userId: string, token: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const logoutToken = new LogoutTokenEntity();
    logoutToken.token = token;
    logoutToken.user = user;
    this.manager.save(logoutToken);
    return user;
  }

  async findTokenByUserIdAndAccessToken(userId: string, token: string): Promise<Boolean> {
    const logoutToken = await this.createQueryBuilder('logoutToken')
      .where('logoutToken.token = :token AND logoutToken.user = :userId', { token, userId })
      .getOne();
    return logoutToken ? true : false;
  }
}
