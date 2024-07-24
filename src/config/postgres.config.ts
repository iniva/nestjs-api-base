import { registerAs } from '@nestjs/config'

export default registerAs('postgres', () => ({
  host: process.env.POSTGRES_HOST || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'dev',
  password: process.env.POSTGRES_PASSWORD || 'dev',
  database: process.env.POSTGRES_DATABASE || 'develop',
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
  logging: ['info', 'warn', 'error'],
  extra: {
    poolSize: 5,
    query_timeout: 10000,
    statement_timeout: 10000,
  },
}))
