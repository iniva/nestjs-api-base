import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

import { TrackerMiddleware } from './common/tracker.middleware'
import configuration from './config/configuration'
import { HealthController } from './health/health.controller'
import { PostsModule } from './posts/posts.module'

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      providers: [ConfigService],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          name: config.get('app.name'),
          level: config.get('logger.logLevel'),
          prettyPrint: config.get('logger.prettyPrint')
            ? {
                colorize: config.get('logger.colorize'),
              }
            : undefined,
        },
      }),
    }),
    PostsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrackerMiddleware).forRoutes('*')
  }
}
