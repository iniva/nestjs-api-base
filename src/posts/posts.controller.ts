import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common'

import { NewPostDto } from '../dtos/new-post.dto'
import { Post as PostType } from '../types/post.type'
import { PostsService } from './posts.service'
import { Sort } from '../types/sort.type'

@Controller('posts')
export class PostsController {
  constructor(private _postService: PostsService) {}

  @Get()
  async list(
    @Query('field') field?: string,
    @Query('order') order?: string,
  ): Promise<PostType[]> {
    const orderValue =
      order && ['ASC', 'DESC'].includes(order.toUpperCase())
        ? order.toUpperCase()
        : 'DESC'

    return await this._postService.findAll({
      field: field ?? 'created_at',
      order: orderValue as Sort['order'],
    })
  }

  @Get('/:id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<PostType> {
    return this._postService.findOne(id)
  }

  @Post()
  async add(@Body() newPost: NewPostDto): Promise<Partial<PostType>> {
    const post = await this._postService.save(newPost)

    return {
      id: post.id,
    }
  }
}
