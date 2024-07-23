import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from './user.entity'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { HashManager } from '../hash.manager'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, HashManager],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
