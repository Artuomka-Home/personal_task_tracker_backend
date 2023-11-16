import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LogoutTokenRepository } from '../auth/logout-token.repository';
import { errorMessages } from '../constants/error-messages';

@Injectable()
export class CronJobsService {
  constructor(private readonly logoutTokenRepository: LogoutTokenRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_3PM)
  async deleteLogoutTokens() {
    const tokens = await this.logoutTokenRepository.find();

    tokens.map((token) => {
      const { created_at } = token;
      const week = 7 * 24 * 60 * 60 * 1000;
      const tokenTimeCreation = created_at.getTime();

      if (Date.now() - tokenTimeCreation > week) {
        try {
          this.logoutTokenRepository.delete(token.id);
        } catch (error) {
          throw new BadRequestException(errorMessages.DELETE_OLD_LOGOUT_TOKENS_ERROR);
        }
      }
    });
  }
}
