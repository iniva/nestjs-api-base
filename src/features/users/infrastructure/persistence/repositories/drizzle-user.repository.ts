import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { DATA_SOURCE } from '@/shared/infrastructure/persistence/constants'
import * as schema from '@/shared/infrastructure/persistence/schema'
import { users } from '@/features/users/infrastructure/persistence/schema/user.schema'
import { User } from '@/features/users/domain/user'
import { UserRepositoryPort } from '@/features/users/application/ports/user.repository.port'
import { UserMapper } from '../mappers/user.mapper'

@Injectable()
export class DrizzleUserRepository implements UserRepositoryPort {
  constructor(
    @Inject(DATA_SOURCE)
    private readonly db: PostgresJsDatabase<typeof schema>,
    private readonly mapper: UserMapper,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.email, email)).limit(1)

    return rows[0] ? this.mapper.toDomain(rows[0]) : undefined
  }

  async findAll(): Promise<User[]> {
    const rows = await this.db.select().from(users)

    return rows.map((row) => this.mapper.toDomain(row))
  }

  async save(user: User): Promise<void> {
    const row = this.mapper.toRow(user)
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
