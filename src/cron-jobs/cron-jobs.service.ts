import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LogoutTokenRepository } from '../auth/logout-token.repository';
import { errorMessages } from '../constants/error-messages';

@Injectable()
export class CronJobsService {
  constructor(private readonly logoutTokenRepository: LogoutTokenRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_3PM)
  async deleteLogoutTokens() {
    try {
      await this.logoutTokenRepository.deleteTokensCreatedAfterOneWeek();
    } catch (error) {
      console.error('error', error.message);
    }
  }
}
