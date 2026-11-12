import { notFound } from 'next/navigation'
import { PageHeading } from '@/components/page-heading'
import { ReadOnlyNote } from '@/components/read-only-note'
import { TargetForm } from '@/components/target-form'
import { isReadOnly } from '@/lib/demo'
import { getTarget } from '@/lib/targets'
import { targetIdSchema } from '@/lib/validation'

export const metadata = { title: 'Edit target - Space Targets' }

export default async function EditTargetPage({ params }: { params: Promise<{ id: string }> }) {
  const id = targetIdSchema.safeParse((await params).id)
  const target = id.success ? await getTarget(id.data) : null
  if (!target) notFound()

  const initial = {
    name: target.name,
    type: target.type,
    distanceLightYears: String(target.distanceLightYears),
    description: target.description ?? '',
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeading title={`Edit ${target.name}`} lead="Change the details and save." />
      {isReadOnly() ? (
        <ReadOnlyNote />
      ) : (
        <TargetForm id={target.id} initial={initial} submitLabel="Save changes" />
      )}
    </div>
  )
}
