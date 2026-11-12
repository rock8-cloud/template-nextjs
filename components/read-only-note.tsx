import Link from 'next/link'
import { READ_ONLY_MESSAGE } from '@/lib/demo'

export function ReadOnlyNote() {
  return (
    <div className="rounded-lg border border-line bg-panel p-6 text-sm text-muted">
      <p>{READ_ONLY_MESSAGE}</p>
      <Link href="/" className="btn mt-4">
        Back to targets
      </Link>
    </div>
  )
}
