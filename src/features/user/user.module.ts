import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthorizationModule } from '../auth/authorization.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/user.service';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { GetUsersHandler } from './queries/handlers/get-users.handler';

const USER_CQRS_HANDLERS = [GetUsersHandler];

@Module({
  imports: [PrismaModule, AuthorizationModule, CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, ...USER_CQRS_HANDLERS],
  exports: [UsersService],
})
export class UsersModule {}
