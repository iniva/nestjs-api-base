import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common'
import { v4 as uuid } from 'uuid'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { User } from 'src/typings/user.type'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user: User = {
      id: uuid(),
      email: dto.email,
      password: dto.password, // <- encrypt this
      active: true,
      firstname: null,
      lastname: null
    }

    const existing = await this.usersService.findOne(user.email)

    if (existing) {
      throw new HttpException(
        `Email ${user.email} is already registered`,
        HttpStatus.BAD_REQUEST
      )
    }

    await this.usersService.save(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<Partial<User>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, active, id, ...publicUser } = await this.usersService.findOne(req.user.email)

    return publicUser
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.findOne(req.user.email)
    const updatedUser: User = {
      ...user,
      ...dto
    }

    await this.usersService.save(updatedUser)
  }
}
