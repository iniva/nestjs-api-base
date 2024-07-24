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

  // OpenAPI docs
  const documentationConfig = configService.get('documentation')
  const config = new DocumentBuilder()
    .setTitle(documentationConfig.name)
    .setDescription(documentationConfig.description)
    .setVersion(documentationConfig.version)
    .build()
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey, methodKey) => {
      return methodKey.replace(/([a-z])([A-Z])/g, `$1 $2`)
    },
  })

  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: documentationConfig.name,
  })

  await app.listen(configService.get('app.port'))
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
