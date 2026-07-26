import { AuthedUser } from '@/features/users/domain/user'

export abstract class AuthServicePort {
  abstract validateUser(email: string, password: string): Promise<AuthedUser | null>
  abstract login(user: AuthedUser): Promise<{ access_token: string }>
}
