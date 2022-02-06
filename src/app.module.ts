import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HealthController } from './health/health.controller'
import { AuthModule } from './auth/auth.module'
import { TrackerMiddleware } from './common/tracker.middleware'
import { UsersModule } from './users/users.module'
import { HashManager } from './hash.manager'
import configuration from './config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      providers: [ConfigService],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          // name: config.get('app.name'),
          level: config.get('logger.logLevel'),
          redact: {
            paths: [
              'req.headers.authorization'
            ],
            censor: '[redacted]'
          }
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        logging: configService.get('database.logging'),
        synchronize: configService.get('database.synchronize'),
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      })
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [
    AppController,
    HealthController
  ],
  providers: [AppService, HashManager],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrackerMiddleware).forRoutes('*')
  }
}
