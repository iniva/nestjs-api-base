import { registerAs } from '@nestjs/config'

export default registerAs('postgres', () => ({
  host: process.env.POSTGRES_HOST || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'dev',
  password: process.env.POSTGRES_PASSWORD || 'dev',
  database: process.env.POSTGRES_DATABASE || 'develop',
  poolSize: 5,
}))
