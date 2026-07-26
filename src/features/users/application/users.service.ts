import { Injectable } from '@nestjs/common'

import { User } from '@/features/users/domain/user'
import { UserRepositoryPort } from './ports/user.repository.port'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepositoryPort) {}

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
