import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HealthController } from './health/health.controller'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { HashManager } from './hash.manager'
import appConfig from './config/app.config'
import pgConfig from './config/postgres.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, pgConfig],
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      providers: [ConfigService],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          // name: config.get('app.name'),
          level: config.get('app.log.level'),
          redact: {
            paths: ['req.headers.authorization'],
            censor: '[redacted]',
          },
        },
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HashManager],
})
export class AppModule {}
