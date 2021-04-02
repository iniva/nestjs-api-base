import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as helmet from 'helmet'

import { AppModule } from './app.module'

async function boostrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  // set Express-specific configs
  for (const [option, value] of Object.entries(configService.get('app'))) {
    app.set(option, value)
  }

  app.useLogger(configService.get('logger.logLevel'))

  // Guard API against some harmful headers
  app.use(helmet())

  await app.listen(configService.get('server.port'))
}

boostrap()
