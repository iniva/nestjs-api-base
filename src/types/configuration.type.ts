import { ValidationPipeOptions } from '@nestjs/common'

export type Configuration = {
  environment: string
  server: {
    port: number
    host: string
  }
  app: {
    name: string
    version: string
    'case sensitive routing': boolean
    'strict routing': boolean
    'x-powered-by': boolean
  }
  logger: {
    logLevel: string
    prettyPrint: boolean
    colorize: boolean
  }
  validation: ValidationPipeOptions
}
