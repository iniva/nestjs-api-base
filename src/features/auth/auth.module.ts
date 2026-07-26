import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { HashManager } from '@/shared/common/hash.manager'
import { UsersModule } from '@/features/users/users.module'
import { AuthService } from './application/auth.service'
import { JwtStrategy } from './infrastructure/jwt.strategy'
import { LocalStrategy } from './infrastructure/local.strategy'
import { AuthController } from './presenter/http/auth.controller'
import { jwtConstants } from './constants'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.token_expiration as any,
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, HashManager],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
