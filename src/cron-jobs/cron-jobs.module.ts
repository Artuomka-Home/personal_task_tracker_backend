import { Module } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';
import { UserRepository } from '../user/user.repository';
import { LogoutTokenRepository } from '../auth/logout-token.repository';

@Module({
  providers: [CronJobsService, UserRepository, LogoutTokenRepository],
})
export class CronJobsModule {}
