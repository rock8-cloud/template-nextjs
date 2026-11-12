import type { FieldErrors } from './validation.ts'
import { isReadOnly, READ_ONLY_MESSAGE } from './demo.ts'

type ErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'not_found'
  | 'conflict'
  | 'read_only'
  | 'internal_error'

export function apiError(status: number, code: ErrorCode, message: string, fields?: FieldErrors) {
  return Response.json({ error: { code, message, ...(fields && { fields }) } }, { status })
}

export function readOnlyResponse() {
  return isReadOnly() ? apiError(403, 'read_only', READ_ONLY_MESSAGE) : null
}

export async function readJson(request: Request): Promise<{ ok: true; data: unknown } | { ok: false }> {
  try {
    return { ok: true, data: await request.json() }
  } catch {
    return { ok: false }
  }
}

export function serverError(error: unknown) {
  console.error(error)
  return apiError(500, 'internal_error', 'Something went wrong on the server.')
}
