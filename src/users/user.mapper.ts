import { users } from '@/database/schema'
import { User } from './user.type'

type UserRow = typeof users.$inferSelect
type NewUserRow = typeof users.$inferInsert

export class UserMapper {
  static toDomain(row: UserRow): User {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.firstName,
      lastName: row.lastName,
      active: row.active,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }

  static toEntity(user: User): NewUserRow {
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
