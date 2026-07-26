import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/shared/infrastructure/persistence/database.module'
import { HashManager } from '@/shared/common/hash.manager'
import { UsersService } from './application/users.service'
import { UserRepositoryPort } from './application/ports/user.repository.port'
import { DrizzleUserRepository } from './infrastructure/persistence/repositories/drizzle-user.repository'
import { UserMapper } from './infrastructure/persistence/mappers/user.mapper'
import { UsersController } from './presenter/http/users.controller'

@Module({
  imports: [DatabaseModule],
  providers: [
    UsersService,
    UserMapper,
    HashManager,
    { provide: UserRepositoryPort, useClass: DrizzleUserRepository },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
