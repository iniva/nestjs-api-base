import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  @IsEmail()
  email: string
}
