'use server'

import { redirect } from 'next/navigation'
import { isReadOnly, READ_ONLY_MESSAGE } from '@/lib/demo'
import { createTarget, deleteTarget, NameTakenError, updateTarget } from '@/lib/targets'
import { fieldErrors, targetCreateSchema, targetIdSchema } from '@/lib/validation'
import type { FieldErrors } from '@/lib/validation'

export type FormValues = Record<'name' | 'type' | 'distanceLightYears' | 'description', string>

export type FormState = {
  message?: string
  errors?: FieldErrors
  values?: FormValues
}

function readForm(formData: FormData) {
  const text = (key: keyof FormValues) => String(formData.get(key) ?? '')
  const values: FormValues = {
    name: text('name'),
    type: text('type'),
    distanceLightYears: text('distanceLightYears'),
    description: text('description'),
  }
  const distance = values.distanceLightYears.trim()
  const parsed = targetCreateSchema.safeParse({
    ...values,
    distanceLightYears: distance === '' ? undefined : Number(distance),
  })
  return { values, parsed }
}

export async function saveTargetAction(
  id: number | null,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const { values, parsed } = readForm(formData)
  if (isReadOnly()) return { message: READ_ONLY_MESSAGE, values }
  if (!parsed.success) {
    return { message: 'Please fix the marked fields.', errors: fieldErrors(parsed.error), values }
  }

  try {
    if (id === null) {
      await createTarget(parsed.data)
    } else if (!(await updateTarget(id, parsed.data))) {
      return { message: 'This target no longer exists.', values }
    }
  } catch (error) {
    if (error instanceof NameTakenError) return { errors: { name: [error.message] }, values }
    console.error(error)
    return { message: 'Could not save the target. Please try again.', values }
  }

  redirect(id === null ? '/?notice=created' : '/?notice=updated')
}

export async function deleteTargetAction(formData: FormData): Promise<void> {
  if (isReadOnly()) redirect('/?notice=read-only')

  const id = targetIdSchema.safeParse(formData.get('id'))
  let deleted = false
  try {
    deleted = id.success && (await deleteTarget(id.data))
  } catch (error) {
    console.error(error)
    redirect('/?notice=failed')
  }
  redirect(deleted ? '/?notice=deleted' : '/?notice=missing')
}
