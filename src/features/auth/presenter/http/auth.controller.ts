import { Controller, Post, Request, UseGuards } from '@nestjs/common'

import { LocalAuthGuard } from '@/shared/common/guards/local-auth.guard'
import { AuthService } from '@/features/auth/application/auth.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user)
  }
}
