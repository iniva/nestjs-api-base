import { User } from '@/features/users/domain/user'

export abstract class UserRepositoryPort {
  abstract findOne(email: string): Promise<User | undefined>
  abstract findAll(): Promise<User[]>
  abstract save(user: User): Promise<void>
}
