import { Injectable } from '@nestjs/common'

import { User } from './user.type'
import { DatabaseService } from '@/database/database.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(
    private dbService: DatabaseService,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.dbService.user.findMany()

    return users
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.dbService.user.findUnique({ where: { email } })

    if (!user) {
      return undefined
    }

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.dbService.user.create({ data })
  }

  async update(email: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.dbService.user.update({ data, where: { email } })
  }
}
