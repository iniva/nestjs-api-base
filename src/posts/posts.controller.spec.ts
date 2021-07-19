import { Test } from '@nestjs/testing'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'

describe('PostsController', () => {
  let controller: PostsController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    }).compile()

    controller = module.get<PostsController>(PostsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
