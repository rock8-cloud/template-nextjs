import { pingDatabase } from '@/lib/targets'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await pingDatabase()
    return Response.json({ status: 'ok', database: 'up' })
  } catch (error) {
    console.error(error)
    return Response.json({ status: 'error', database: 'down' }, { status: 503 })
  }
}
