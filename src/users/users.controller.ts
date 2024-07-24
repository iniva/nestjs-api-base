import { BadRequestException, Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common'
import { v4 as uuid } from 'uuid'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { User } from './user.type'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { HashManager } from '../hash.manager'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private hashManager: HashManager,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user: User = {
      id: uuid(),
      email: dto.email,
      password: await this.hashManager.createHash(dto.password),
      active: true,
      createdAt: new Date(),
    }

    const existing = await this.usersService.findOne(user.email)

    if (existing) {
      throw new BadRequestException(`Email ${user.email} is already registered`)
    }

    await this.usersService.save(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<Partial<User>> {
    const { password, active, id, ...publicUser } = await this.usersService.findOne(req.user.email)

    return publicUser
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req, @Body() dto: UpdateUserDto): Promise<void> {
    const user = await this.usersService.findOne(req.user.email)

    if (dto.password) {
      dto.password = await this.hashManager.createHash(dto.password)
    }

    const updatedUser: User = {
      ...user,
      ...dto,
    }

    await this.usersService.save(updatedUser)
  }
}
