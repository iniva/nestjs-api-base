import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsOptional()
  lastName?: string
}
