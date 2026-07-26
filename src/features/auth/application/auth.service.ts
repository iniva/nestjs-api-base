import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthedUser } from '@/features/users/domain/user'
import { UsersService } from '@/features/users/application/users.service'
import { HashManager } from '@/shared/common/hash.manager'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashManager: HashManager,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthedUser | null> {
    const user = await this.usersService.findOne(email)
    const equalPasswords = this.hashManager.equals(pass, user?.password || '')

    if (user && equalPasswords) {
      const { password, ...result } = user

      return result
    }

    return null
  }

  async login(user: AuthedUser): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
