import { apiError, readJson, readOnlyResponse, serverError } from '@/lib/api'
import { createTarget, listTargets, NameTakenError } from '@/lib/targets'
import { fieldErrors, targetCreateSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return Response.json(await listTargets())
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(request: Request) {
  const refused = readOnlyResponse()
  if (refused) return refused

  const body = await readJson(request)
  if (!body.ok) return apiError(400, 'invalid_json', 'The request body must be valid JSON.')

  const parsed = targetCreateSchema.safeParse(body.data)
  if (!parsed.success) {
    return apiError(400, 'validation_error', 'Some fields are not valid.', fieldErrors(parsed.error))
  }

  try {
    const target = await createTarget(parsed.data)
    return Response.json(target, {
      status: 201,
      headers: { Location: `/api/targets/${target.id}` },
    })
  } catch (error) {
    if (error instanceof NameTakenError) return apiError(409, 'conflict', error.message)
    return serverError(error)
  }
}
