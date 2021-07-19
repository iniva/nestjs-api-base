import { BadRequestFactory } from 'src/common/bad-request.factory'
import { version } from '../../package.json'
import { Configuration } from '../types/configuration.type'

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
      prettyPrint: false, //process.env.NODE_ENV !== 'production',
      colorize: process.env.NODE_ENV !== 'production',
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
  }
}

export default configuration
