import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(8)
  declare password: string

  @IsString()
  @IsEmail()
  declare email: string
}
