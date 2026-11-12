import { apiError, readJson, readOnlyResponse, serverError } from '@/lib/api'
import { deleteTarget, getTarget, NameTakenError, updateTarget } from '@/lib/targets'
import { fieldErrors, targetIdSchema, targetUpdateSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

type Context = { params: Promise<{ id: string }> }

async function parseId(context: Context) {
  const { id } = await context.params
  return targetIdSchema.safeParse(id)
}

const invalidId = () => apiError(400, 'validation_error', 'Id must be a positive whole number.')
const notFound = (id: number) => apiError(404, 'not_found', `No target with id ${id}.`)

export async function GET(_request: Request, context: Context) {
  const id = await parseId(context)
  if (!id.success) return invalidId()

  try {
    const target = await getTarget(id.data)
    return target ? Response.json(target) : notFound(id.data)
  } catch (error) {
    return serverError(error)
  }
}

export async function PATCH(request: Request, context: Context) {
  const refused = readOnlyResponse()
  if (refused) return refused

  const id = await parseId(context)
  if (!id.success) return invalidId()

  const body = await readJson(request)
  if (!body.ok) return apiError(400, 'invalid_json', 'The request body must be valid JSON.')

  const parsed = targetUpdateSchema.safeParse(body.data)
  if (!parsed.success) {
    return apiError(400, 'validation_error', 'Some fields are not valid.', fieldErrors(parsed.error))
  }

  try {
    const target = await updateTarget(id.data, parsed.data)
    return target ? Response.json(target) : notFound(id.data)
  } catch (error) {
    if (error instanceof NameTakenError) return apiError(409, 'conflict', error.message)
    return serverError(error)
  }
}

export async function DELETE(_request: Request, context: Context) {
  const refused = readOnlyResponse()
  if (refused) return refused

  const id = await parseId(context)
  if (!id.success) return invalidId()

  try {
    const deleted = await deleteTarget(id.data)
    return deleted ? new Response(null, { status: 204 }) : notFound(id.data)
  } catch (error) {
    return serverError(error)
  }
}
