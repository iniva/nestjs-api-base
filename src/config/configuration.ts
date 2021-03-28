import { Configuration } from '../types/configuration.type'

const configuration = (): Configuration => {
  return {
    server: {
      port: Number.parseInt(process.env.SERVER_PORT, 10) || 8091,
      host: process.env.SERVER_HOST || '0.0.0.0',
    },
    app: {
      name: process.env.APP_NAME || 'NestJS API',
      logLevel: process.env.LOG_LEVEL || 'log',
    },
  }
}

export default configuration
