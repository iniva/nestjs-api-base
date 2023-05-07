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

  documentation: {
    name: string
    description: string
    version: string
  }

  logger: {
    logLevel: string
  }

  validation: ValidationPipeOptions

  database: {
    host: string
    port: number
    username: string
    password: string
    name: string
    synchronize: boolean
    logging: boolean
  }
}
