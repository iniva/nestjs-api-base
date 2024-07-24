import { Test, TestingModule } from '@nestjs/testing'

import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { HashManager } from '../hash.manager'
import { ConfigService } from '@nestjs/config'

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
