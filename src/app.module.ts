import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { HealthController } from './health/health.controller'
import { PostsModule } from './posts/posts.module'

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PostsModule,
  ],
})
export class AppModule {}
