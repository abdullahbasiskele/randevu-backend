import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthorizationModule } from '../auth/authorization.module';
import { UsersController } from './controllers/users.controller';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { GetUsersHandler } from './application/queries/handlers/get-users.handler';
import { UserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';

const USER_CQRS_HANDLERS = [GetUsersHandler];

@Module({
  imports: [PrismaModule, AuthorizationModule, CqrsModule],
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    ...USER_CQRS_HANDLERS,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
