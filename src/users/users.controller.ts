import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

@Controller('users')
export class UsersController {
  @Post('register')
  register() {
    return {
      msg: 'hey!'
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
