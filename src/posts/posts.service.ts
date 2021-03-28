import { Injectable } from '@nestjs/common'
import { Post } from '../types/post.type'

@Injectable()
export class PostsService {
  private readonly posts: Post[] = []

  async findAll(): Promise<Post[]> {
    return this.posts
  }

  async save(post: Post): Promise<void> {
    this.posts.push(post)
  }
}
