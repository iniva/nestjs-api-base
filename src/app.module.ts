import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { TypeOrmModule } from '@nestjs/typeorm'

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
    }),
    LoggerModule.forRootAsync({
      providers: [ConfigService],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          // name: config.get('app.name'),
          level: config.get('app.log.logLevel'),
          redact: {
            paths: ['req.headers.authorization'],
            censor: '[redacted]',
          },
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('postgres.host'),
        port: configService.get('postgres.port'),
        username: configService.get('postgres.username'),
        password: configService.get('postgres.password'),
        postgres: configService.get('postgres.name'),
        logging: configService.get('postgres.logging'),
        synchronize: configService.get('postgres.synchronize'),
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HashManager],
})
export class AppModule {}
