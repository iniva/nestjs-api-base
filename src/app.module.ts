import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

import { HealthController } from './health/health.controller'
import { AuthModule } from './features/auth/auth.module'
import { UsersModule } from './features/users/users.module'
import appConfig from './configs/app.config'
import pgConfig from './configs/postgres.config'

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
  controllers: [HealthController],
})
export class AppModule {}
