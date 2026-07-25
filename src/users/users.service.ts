import { Injectable } from '@nestjs/common'

import { User } from './user.type'
import { UserRepository } from './user.repository'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne(email)
  }

  async save(user: User): Promise<void> {
    return this.userRepository.save(user)
  }
}
