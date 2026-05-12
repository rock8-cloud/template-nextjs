import { pool } from '@/lib/db'

export async function GET() {
  const { rows } = await pool.query(
    'SELECT id, name, type, distance_light_years FROM space_target ORDER BY id'
  )
  return Response.json(rows)
}
