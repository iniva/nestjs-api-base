import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from 'nestjs-pino'
import helmet from 'helmet'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true })
  const configService = app.get(ConfigService)

  // Sets Express-specific configs
  for (const [option, value] of Object.entries(configService.get('app.expressOptions'))) {
    app.set(option, value)
  }

  // Adds customised Logger
  app.useLogger(app.get(Logger))

  // Guards API against some harmful headers
  app.use(helmet())

  // Enables App level protection against incorrect data
  app.useGlobalPipes(new ValidationPipe(configService.get('app.validation')))

  app.enableShutdownHooks()

  await app.listen(configService.get('app.port'))
}

bootstrap()
