import { users } from '@/database/schema'

export type User = typeof users.$inferSelect

export type AuthedUser = Pick<User, 'id' | 'email'>
