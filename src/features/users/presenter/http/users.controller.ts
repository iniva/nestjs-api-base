import { randomUUID } from 'node:crypto'
import { BadRequestException, Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '@/shared/common/guards/jwt-auth.guard'
import { HashManager } from '@/shared/common/hash.manager'
import { User } from '@/features/users/domain/user'
import { UsersService } from '@/features/users/application/users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashManager: HashManager,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const existing = await this.usersService.findOne(dto.email)

    if (existing) {
      throw new BadRequestException(`Email ${dto.email} is already registered`)
    }

    const user = new User()
    user.id = randomUUID()
    user.email = dto.email
    user.password = this.hashManager.createHash(dto.password)
    user.firstName = null
    user.lastName = null
    user.active = true
    user.createdAt = new Date()
    user.updatedAt = null

    await this.usersService.save(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any): Promise<Partial<User>> {
    const { password, active, id, ...publicUser } = (await this.usersService.findOne(req.user.email))!

    return publicUser
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req: any, @Body() dto: UpdateUserDto): Promise<void> {
    const user = await this.usersService.findOne(req.user.email)

    if (dto.password) {
      dto.password = this.hashManager.createHash(dto.password)
    }

    const updatedUser: User = {
      ...user!,
      ...dto,
    }

    await this.usersService.save(updatedUser)
  }
}
