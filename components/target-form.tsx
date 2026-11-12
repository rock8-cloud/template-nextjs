'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { saveTargetAction } from '@/app/actions'
import type { FormState, FormValues } from '@/app/actions'

type Props = {
  id: number | null
  initial: FormValues
  submitLabel: string
}

type FieldProps = {
  name: keyof FormValues
  label: string
  hint?: string
  state: FormState
  initial: FormValues
  children: (props: {
    id: string
    name: string
    defaultValue: string
    'aria-invalid': boolean
    'aria-describedby': string | undefined
  }) => React.ReactNode
}

function Field({ name, label, hint, state, initial, children }: FieldProps) {
  const errors = state.errors?.[name]
  const describedBy = errors ? `${name}-error` : hint ? `${name}-hint` : undefined

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children({
        id: name,
        name,
        defaultValue: state.values?.[name] ?? initial[name],
        'aria-invalid': Boolean(errors),
        'aria-describedby': describedBy,
      })}
      {errors ? (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-danger">
          {errors[0]}
        </p>
      ) : (
        hint && (
          <p id={`${name}-hint`} className="mt-1.5 text-sm text-faint">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

export function TargetForm({ id, initial, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(saveTargetAction.bind(null, id), {})
  const shared = { state, initial }

  return (
    <form action={formAction} noValidate className="space-y-5 rounded-lg border border-line bg-panel p-6">
      {state.message && (
        <p role="alert" className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.message}
        </p>
      )}

      <Field name="name" label="Name" {...shared}>
        {(props) => <input {...props} className="field" placeholder="Betelgeuse" autoFocus />}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="type" label="Type" {...shared}>
          {(props) => <input {...props} className="field" placeholder="Red supergiant" />}
        </Field>
        <Field name="distanceLightYears" label="Distance" hint="In light years." {...shared}>
          {(props) => (
            <input {...props} className="field font-mono" inputMode="decimal" placeholder="548" />
          )}
        </Field>
      </div>

      <Field name="description" label="Description" hint="Optional." {...shared}>
        {(props) => <textarea {...props} className="field min-h-24" rows={3} />}
      </Field>

      <div className="flex items-center gap-2 pt-1">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Saving...' : submitLabel}
        </button>
        <Link href="/" className="btn btn-quiet h-9">
          Cancel
        </Link>
      </div>
    </form>
  )
}
