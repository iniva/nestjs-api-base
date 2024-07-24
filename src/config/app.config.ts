import { registerAs } from '@nestjs/config'

import { BadRequestFactory } from '../common/bad-request.factory'
import { description, version } from '../../package.json'

const appName = process.env.APP_NAME || 'NestJS API'

export default registerAs('app', () => ({
  expressOptions: {
    'case sensitive routing': true,
    'strict routing': false,
    'x-powered-by': false,
    version,
  },
  environment: process.env.APP_ENV || 'staging',
  port: Number.parseInt(process.env.APP_PORT, 10) || 3000,
  log: {
    level: process.env.APP_LOG_LEVEL || 'log',
  },
  hash: {
    salt: process.env.APP_HASH_SALT,
    iterations: Number.parseInt(process.env.APP_HASH_ITERATIONS, 10) || 10000,
  },
  validation: {
    whitelist: true,
    forbidUnknownValues: true,
    validationError: {
      target: false,
      value: true,
    },
    exceptionFactory: (errors: any) => BadRequestFactory.createFromErrors(errors),
  },
  documentation: {
    name: appName,
    description,
    version,
  },
}))
