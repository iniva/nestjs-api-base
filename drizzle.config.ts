import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './drizzle/migrations',
  dbCredentials: {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'dev',
    password: process.env.POSTGRES_PASSWORD || 'dev',
    database: process.env.POSTGRES_DATABASE || 'develop',
    ssl: false,
  },
})
