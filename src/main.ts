import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from 'nestjs-pino'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true })
  const configService = app.get(ConfigService)

  // set Express-specific configs
  for (const [option, value] of Object.entries(configService.get('app'))) {
    app.set(option, value)
  }

  // Add censor options to Logger to hide sensitive data
  app.useLogger(app.get(Logger))

  // Guard API against some harmful headers
  app.use(helmet())

  // Enable App level protection against incorrect data
  app.useGlobalPipes(new ValidationPipe(configService.get('validation')))

  // OpenAPI docs
  const documentationConfig = configService.get('documentation')
  const config = new DocumentBuilder()
    .setTitle(documentationConfig.name)
    .setDescription(documentationConfig.description)
    .setVersion(documentationConfig.version)
    .build()
  const document = SwaggerModule.createDocument(app, config)

  writeFileSync(resolve('client/api-docs.json'), JSON.stringify(document, null, 2), { encoding: 'utf-8' })

  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: documentationConfig.name
  })

  await app.listen(configService.get('server.port'))
}
bootstrap()
