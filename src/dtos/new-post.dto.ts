import { IsString, MinLength } from 'class-validator'

export class NewPostDto {
  @IsString()
  @MinLength(5)
  title: string

  @IsString()
  content: string
}
