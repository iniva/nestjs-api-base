import { Injectable } from '@nestjs/common'

import { User } from '@/features/users/domain/user'
import { UserRow, NewUserRow } from '../schema/user.schema'

@Injectable()
export class UserMapper {
  toDomain(row: UserRow): User {
    const user = new User()
    user.id = row.id
    user.email = row.email
    user.password = row.password
    user.firstName = row.firstName
    user.lastName = row.lastName
    user.active = row.active
    user.createdAt = row.createdAt
    user.updatedAt = row.updatedAt
    return user
  }

  toRow(user: User): NewUserRow {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
