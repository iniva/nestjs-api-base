import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthedUser } from '../users/user.type'
import { UsersService } from '../users/users.service'
import { HashManager } from '../hash.manager'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashManager: HashManager,
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

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
