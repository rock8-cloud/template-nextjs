'use client'

import { useFormStatus } from 'react-dom'
import { deleteTargetAction } from '@/app/actions'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-quiet btn-danger" disabled={pending}>
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

export function DeleteButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteTargetAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${name}?`)) event.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Submit />
    </form>
  )
}
