import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { v4 as uuid } from 'uuid'

import { NewPostDto } from 'src/dtos/new-post.dto'
import { Post } from '../types/post.type'
import { Sort } from '../types/sort.type'

// Basic in memory implementation
@Injectable()
export class PostsService {
  private _posts: Post[] = []

  async findAll(
    sort: Sort = { field: 'created_at', order: 'DESC' },
  ): Promise<Post[]> {
    const posts = this._posts

    if (posts.length === 0) {
      return posts
    }

    const sortField =
      typeof posts[0][sort.field] !== 'undefined' ? sort.field : 'created_at'
    const typeOfData = typeof posts[0][sortField]

    if (!['string', 'number', 'object'].includes(typeOfData)) {
      return posts
    }

    if (typeOfData === 'object' && !(posts[0][sortField] instanceof Date)) {
      return posts
    }

    switch (true) {
      case typeOfData === 'string': {
        if (sort.order === 'DESC') {
          return posts.sort((a, b) => b[sortField].localeCompare(a[sortField]))
        }

        return posts.sort((a, b) => a[sortField].localeCompare(b[sortField]))
      }

      case typeOfData === 'object': {
        if (sort.order === 'DESC') {
          return posts.sort((a, b) => b[sortField] - a[sortField])
        }

        return posts.sort((a, b) => a[sortField] - b[sortField])
      }

      default: {
        if (sort.order === 'DESC') {
          return posts.sort((a, b) => b[sortField] - a[sortField])
        }

        return posts.sort((a, b) => a[sortField] - b[sortField])
      }
    }
  }

  async findOne(id: string): Promise<Post> {
    const post = this._posts.find((post) => post.id === id)

    if (post === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }

    return post
  }

  async save(newPost: NewPostDto): Promise<void> {
    const post: Post = {
      id: uuid(),
      ...newPost,
      created_at: new Date(),
    }

    this._posts.push(post)
  }
}
