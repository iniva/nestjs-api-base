import { DataSource } from 'typeorm'
import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { DATA_SOURCE } from './constants'

export const databaseProviders: Provider[] = [
  {
    inject: [ConfigService],
    provide: DATA_SOURCE,
    useFactory: async (config: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: config.get('postgres.host'),
        port: config.get('postgres.port'),
        username: config.get('postgres.username'),
        password: config.get('postgres.password'),
        database: config.get('postgres.database'),
        logging: config.get('postgres.logging'),
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsRun: true,
        synchronize: false,
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      })

      return dataSource.initialize()
    },
  },
]
