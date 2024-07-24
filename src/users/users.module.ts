import { Module } from '@nestjs/common'

import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { HashManager } from '../hash.manager'
import { DatabaseModule } from '@/database/database.module'
import { userProviders } from './user.providers'

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UsersService, HashManager],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
