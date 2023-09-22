import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './auth/user.module';
import { UserEntity } from './auth/user.entity';

@Module({
  imports: [ 
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: 5432,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [UserEntity],
      synchronize: true, // shouldn't be used in production - otherwise you can lose production data.
    }),
  UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
