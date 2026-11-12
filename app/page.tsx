import Link from 'next/link'
import { DeleteButton } from '@/components/delete-button'
import { isReadOnly, READ_ONLY_MESSAGE } from '@/lib/demo'
import { listTargets } from '@/lib/targets'
import type { SpaceTarget } from '@/lib/targets'

const notices: Record<string, { text: string; tone: 'ok' | 'danger' }> = {
  created: { text: 'Target added.', tone: 'ok' },
  updated: { text: 'Changes saved.', tone: 'ok' },
  deleted: { text: 'Target deleted.', tone: 'ok' },
  missing: { text: 'That target no longer exists.', tone: 'danger' },
  failed: { text: 'Could not delete the target. Please try again.', tone: 'danger' },
  'read-only': { text: READ_ONLY_MESSAGE, tone: 'danger' },
}

const distanceFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })

function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-line bg-panel px-5 py-4">
      <dt className="text-xs font-medium tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-2 truncate text-xl font-semibold tracking-tight">{value}</dd>
      <dd className="mt-0.5 font-mono text-xs text-faint">{detail ?? ' '}</dd>
    </div>
  )
}

function AddButton({ readOnly }: { readOnly: boolean }) {
  if (readOnly) {
    return (
      <button type="button" className="btn btn-primary" disabled title={READ_ONLY_MESSAGE}>
        Add target
      </button>
    )
  }
  return (
    <Link href="/targets/new" className="btn btn-primary">
      Add target
    </Link>
  )
}

function EmptyState({ readOnly }: { readOnly: boolean }) {
  return (
    <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center">
      <h2 className="text-lg font-semibold">No targets yet</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
        {readOnly
          ? 'The list is empty and this demo is read-only.'
          : 'Add the first one here or send a POST request to /api/targets.'}
      </p>
      {!readOnly && (
        <div className="mt-6">
          <AddButton readOnly={false} />
        </div>
      )}
    </div>
  )
}

function TargetTable({ targets, readOnly }: { targets: SpaceTarget[]; readOnly: boolean }) {
  const heading = 'px-5 py-3 text-xs font-medium tracking-wide text-muted uppercase'

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-panel">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line">
          <tr>
            <th className={heading}>Name</th>
            <th className={heading}>Type</th>
            <th className={`${heading} text-right`}>Distance</th>
            <th className={heading}>Updated</th>
            {!readOnly && <th className={`${heading} text-right`}>Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {targets.map((target) => (
            <tr key={target.id} className="transition-colors hover:bg-raised/60">
              <td className="max-w-md px-5 py-3.5">
                <div className="font-medium">{target.name}</div>
                {target.description && (
                  <div className="mt-0.5 truncate text-muted">{target.description}</div>
                )}
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap">
                <span className="rounded-full border border-line bg-raised px-2.5 py-1 text-xs text-muted">
                  {target.type}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right font-mono whitespace-nowrap tabular-nums">
                {distanceFormat.format(target.distanceLightYears)}
                <span className="ml-1.5 text-faint">ly</span>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-muted">
                {dateFormat.format(target.updatedAt)}
              </td>
              {!readOnly && (
                <td className="px-3 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/targets/${target.id}/edit`} className="btn btn-quiet">
                      Edit
                    </Link>
                    <DeleteButton id={target.id} name={target.name} />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>
}) {
  const { notice: noticeKey } = await searchParams
  const notice = noticeKey ? notices[noticeKey] : undefined
  const readOnly = isReadOnly()
  const targets = await listTargets()
  const nearest = targets.at(0)
  const farthest = targets.at(-1)
  const lightYears = (target?: SpaceTarget) =>
    target && `${distanceFormat.format(target.distanceLightYears)} ly`

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Targets</h1>
          <p className="mt-1 text-sm text-muted">
            Stars, clusters and nebulae worth pointing a telescope at, nearest first.
          </p>
        </div>
        <AddButton readOnly={readOnly} />
      </div>

      {readOnly && (
        <p className="mb-6 rounded-md border border-accent/25 bg-accent/5 px-4 py-2.5 text-sm text-accent-strong">
          {READ_ONLY_MESSAGE} You can still browse the list and read from the API.
        </p>
      )}

      {notice && (
        <p
          role="status"
          className={`mb-6 rounded-md border px-4 py-2.5 text-sm ${
            notice.tone === 'ok'
              ? 'border-ok/25 bg-ok/5 text-ok'
              : 'border-danger/30 bg-danger/10 text-danger'
          }`}
        >
          {notice.text}
        </p>
      )}

      {targets.length === 0 ? (
        <EmptyState readOnly={readOnly} />
      ) : (
        <>
          <dl className="mb-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Targets" value={String(targets.length)} detail="in the database" />
            <Stat label="Nearest" value={nearest?.name ?? '-'} detail={lightYears(nearest)} />
            <Stat label="Farthest" value={farthest?.name ?? '-'} detail={lightYears(farthest)} />
          </dl>
          <TargetTable targets={targets} readOnly={readOnly} />
        </>
      )}

      <p className="mt-6 text-sm text-faint">
        The same data is served as JSON at{' '}
        <code className="font-mono text-muted">/api/targets</code>
        . See the{' '}
        <Link href="/swagger" className="text-muted underline-offset-4 hover:text-text hover:underline">
          API docs
        </Link>{' '}
        for every endpoint.
      </p>
    </>
  )
}
