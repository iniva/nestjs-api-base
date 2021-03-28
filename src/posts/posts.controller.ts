import { Body, Controller, Get, Post } from '@nestjs/common'
import { NewPostDto } from '../dtos/new-post.dto'
import { Post as PostType } from '../types/post.type'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private _postService: PostsService) {}

  @Get()
  async list(): Promise<PostType[]> {
    return this._postService.findAll()
  }

  @Post()
  async add(@Body() newPost: NewPostDto): Promise<void> {
    this._postService.save(newPost)
  }
}
