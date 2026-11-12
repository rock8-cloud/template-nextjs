import * as z from 'zod'

const description = z
  .string()
  .trim()
  .max(500, 'Description can have at most 500 characters.')
  .nullish()
  .transform((value) => value || null)

export const targetCreateSchema = z.object({
  name: z
    .string('Name is required.')
    .trim()
    .min(1, 'Name is required.')
    .max(120, 'Name can have at most 120 characters.'),
  type: z
    .string('Type is required.')
    .trim()
    .min(1, 'Type is required.')
    .max(60, 'Type can have at most 60 characters.'),
  distanceLightYears: z
    .number('Distance must be a number.')
    .positive('Distance must be greater than 0.')
    .max(1e11, 'Distance is too large.'),
  description,
})

export const targetUpdateSchema = targetCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Send at least one field to update.')

export const targetIdSchema = z.coerce
  .number('Id must be a positive whole number.')
  .int('Id must be a positive whole number.')
  .positive('Id must be a positive whole number.')
  .max(2147483647, 'Id must be a positive whole number.')

export type TargetInput = z.infer<typeof targetCreateSchema>
export type TargetPatch = z.infer<typeof targetUpdateSchema>

export type FieldErrors = Record<string, string[]>

export function fieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join('.') : 'form'
    errors[key] = [...(errors[key] ?? []), issue.message]
  }
  return errors
}
