import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import * as schema from './schema'
import { DATA_SOURCE } from './constants'

export const databaseProviders: Provider[] = [
  {
    inject: [ConfigService],
    provide: DATA_SOURCE,
    useFactory: async (config: ConfigService) => {
      const client = postgres({
        host: config.get('postgres.host'),
        port: config.get('postgres.port'),
        username: config.get('postgres.username'),
        password: config.get('postgres.password'),
        database: config.get('postgres.database'),
        max: config.get('postgres.poolSize'),
      })

      const db = drizzle(client, { schema })

      await migrate(db, { migrationsFolder: './drizzle/migrations' })

      return db
    },
  },
]
