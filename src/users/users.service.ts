import { Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

import { User } from './user.type'
import { UserEntity } from './user.entity'
import { USER_REPOSITORY } from '@/database/constants'

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find()

    return users.map((user) => this.hydrate(user))
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } })

    if (!user) {
      return undefined
    }

    return this.hydrate(user)
  }

  async save(user: User): Promise<void> {
    await this.usersRepository.save(this.dehydrate(user))
  }

  private hydrate(entity: UserEntity): User {
    return {
      id: entity.id,
      password: entity.password,
      email: entity.email,
      active: entity.active,
      firstName: entity.firstName,
      lastName: entity.lastName,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  private dehydrate(user: User): UserEntity {
    return {
      id: user.id,
      password: user.password,
      email: user.email,
      active: user.active,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt || null,
    }
  }
}
