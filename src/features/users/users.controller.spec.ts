import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'

import { UsersController } from './presenter/http/users.controller'
import { UsersService } from './application/users.service'
import { HashManager } from '@/shared/common/hash.manager'

describe('UsersController', () => {
  let usersController: UsersController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => 10000,
            getOrThrow: () => '123456',
          },
        },
        HashManager,
      ],
    }).compile()

    usersController = app.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(usersController).toBeDefined()
  })
})
