import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from './user.repository';
import { LogoutTokenRepository } from '../auth/logout-token.repository';
import { GroupRepository } from 'src/group/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UserRepository, LogoutTokenRepository, GroupRepository],
})
export class UserModule {}
