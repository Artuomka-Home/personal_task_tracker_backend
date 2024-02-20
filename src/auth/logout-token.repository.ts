import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LogoutTokenEntity } from '../entities/logout-token.entity';
import { UserEntity } from '../entities/user.entity';
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
    logoutToken.created_at = new Date();
    logoutToken.user = user;
    this.manager.save(logoutToken);
    return user;
  }

  async findTokenByUserIdAndAccessToken(userId: string, token: string): Promise<Boolean> {
    const logoutToken = await this.createQueryBuilder('logout_token')
      .where('logout_token.token = :token AND logout_token.user = :userId', { token, userId })
      .getOne();
    return logoutToken ? true : false;
  }

  async deleteTokensCreatedAfterOneWeek() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const res = await this.createQueryBuilder('logout_token')
      .delete()
      .from(LogoutTokenEntity)
      .where('logout_token.created_at < :oneWeekAgo', { oneWeekAgo })
      .execute();
    return res;
  }
}
