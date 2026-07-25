import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { DATA_SOURCE } from '@/database/constants'
import * as schema from '@/database/schema'
import { users } from '@/database/schema'
import { UserMapper } from './user.mapper'
import { User } from './user.type'

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DATA_SOURCE)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.email, email)).limit(1)

    return rows[0] ? UserMapper.toDomain(rows[0]) : undefined
  }

  async findAll(): Promise<User[]> {
    const rows = await this.db.select().from(users)

    return rows.map((row) => UserMapper.toDomain(row))
  }

  async save(user: User): Promise<void> {
    const row = UserMapper.toEntity(user)
    const { id, ...updateFields } = row

    await this.db
      .insert(users)
      .values(row)
      .onConflictDoUpdate({
        target: users.id,
        set: { ...updateFields, updatedAt: new Date() },
      })
  }
}
