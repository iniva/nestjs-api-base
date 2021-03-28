import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function boostrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  // set Express-specific configs
  // @TODO

  app.useLogger(configService.get('app.logLevel'))

  await app.listen(configService.get('server.port'))
}

boostrap()
