import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from './user.type'
import { UserEntity } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) { }

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
      firstname: entity.firstname,
      lastname: entity.lastname
    }
  }

  private dehydrate(user: User): UserEntity {
    return {
      id: user.id,
      password: user.password,
      email: user.email,
      active: user.active,
      firstname: user.firstname || null,
      lastname: user.lastname || null
    }
  }
}
