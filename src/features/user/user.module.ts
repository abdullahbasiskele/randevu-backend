import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../auth/authorization.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/user.service';

@Module({
  imports: [AuthorizationModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
