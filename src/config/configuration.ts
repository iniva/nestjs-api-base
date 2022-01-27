import { Configuration } from '../typings/configuration.type'
import { BadRequestFactory } from '../common/bad-request.factory'
import { version } from '../../package.json'

const configuration = (): Configuration => {
  return {
    environment: process.env.NODE_ENV,
    server: {
      port: Number.parseInt(process.env.SERVER_PORT, 10) || 8091,
      host: process.env.SERVER_HOST || '0.0.0.0',
    },
    app: {
      name: process.env.APP_NAME || 'NestJS API',
      version,
      'case sensitive routing': true,
      'strict routing': false,
      'x-powered-by': false,
    },
    logger: {
      logLevel: process.env.LOG_LEVEL || 'log',
    },
    validation: {
      whitelist: true,
      forbidUnknownValues: true,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors) => BadRequestFactory.fromErrors(errors),
    },

    database: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'dev',
      password: process.env.DB_PASSWORD || 'dev',
      name: process.env.DB_NAME || 'develop',
      logging: false,
      synchronize: process.env.NODE_ENV !== 'production'
    }
  }
}

export default configuration
