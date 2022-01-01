import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'


import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { jwtConstants } from './constants'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' }
        })
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

describe('validateUser', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' }
        })
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('shoudl return a user object when credentials are valid', async () => {
    const result = await service.validateUser('maria', 'guess')

    expect(result).not.toBeNull()
  })

  it('shoudl return null when credentials are invalid', async () => {
    const result = await service.validateUser('maria', 'noguess')

    expect(result).toBeNull()
  })
})

describe('validateLogin', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' }
        })
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should return a JWT when credentials are valid', async () => {
    const result = await service.login({ id: 3, username: 'maria' })

    expect(result.access_token).toBeDefined()
  })
})
