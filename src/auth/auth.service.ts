import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthedUser } from '../typings/user.type'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<AuthedUser | null> {
    const user = await this.usersService.findOne(email)

    if (user && user.password == pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user

      return result
    }

    return null
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
