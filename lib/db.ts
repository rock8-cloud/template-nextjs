import { Pool } from 'pg'

const connectionString =
  process.env.DATABASE_URL ??
  `postgresql://${process.env.DB_USER ?? 'postgres'}:${process.env.DB_PASSWORD ?? 'postgres'}` +
  `@${process.env.DB_HOST ?? 'localhost'}:${process.env.DB_PORT ?? '5432'}` +
  `/${process.env.DB_NAME ?? 'spacedb'}`

const sslRequired =
  connectionString.includes('sslmode=require') ||
  process.env.DB_SSL_MODE === 'require'

export const pool = new Pool({
  connectionString,
  ...(sslRequired && { ssl: { rejectUnauthorized: false } }),
})
