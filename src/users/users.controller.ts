import { randomUUID } from 'node:crypto'
import { BadRequestException, Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { HashManager } from '../hash.manager'
import { User } from './user.type'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private hashManager: HashManager,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user: User = {
      id: randomUUID(),
      email: dto.email,
      password: this.hashManager.createHash(dto.password),
      active: true,
      createdAt: new Date(),
    }

    const existing = await this.usersService.findByEmail(user.email)

    if (existing) {
      throw new BadRequestException(`Email ${user.email} is already registered`)
    }

    await this.usersService.create(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<Partial<User>> {
    const { password, active, id, ...publicUser } = await this.usersService.findByEmail(req.user.email)

    return publicUser
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req, @Body() dto: UpdateUserDto): Promise<void> {
    const user = await this.usersService.findByEmail(req.user.email)

    if (dto.password) {
      dto.password = this.hashManager.createHash(dto.password)
    }

    const updatedUser: User = {
      ...user,
      ...dto,
    }

    await this.usersService.update(req.user.email, updatedUser)
  }
}
