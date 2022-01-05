import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from 'nestjs-pino'
import * as helmet from 'helmet'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true })
  const configService = app.get(ConfigService)

  // set Express-specific configs
  for (const [option, value] of Object.entries(configService.get('app'))) {
    app.set(option, value)
  }

  app.useLogger(app.get(Logger))

  // Guard API against some harmful headers
  app.use(helmet())

  // Enable App level protection against incorrect data
  app.useGlobalPipes(new ValidationPipe(configService.get('validation')))

  await app.listen(configService.get('server.port'))
}
bootstrap()
