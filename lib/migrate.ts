import { pool } from './db'
import fs from 'fs'
import path from 'path'

export async function migrate() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version      VARCHAR(255) PRIMARY KEY,
        applied_at   TIMESTAMPTZ  DEFAULT NOW()
      )
    `)

    const migrationsDir = path.join(process.cwd(), 'db', 'migrations')
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

    for (const file of files) {
      const { rows } = await client.query(
        'SELECT 1 FROM schema_migrations WHERE version = $1',
        [file]
      )
      if (rows.length === 0) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
        await client.query('BEGIN')
        await client.query(sql)
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file])
        await client.query('COMMIT')
        console.log(`Migration applied: ${file}`)
      }
    }
  } finally {
    client.release()
  }
}
