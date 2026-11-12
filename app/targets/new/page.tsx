import { PageHeading } from '@/components/page-heading'
import { ReadOnlyNote } from '@/components/read-only-note'
import { TargetForm } from '@/components/target-form'
import { isReadOnly } from '@/lib/demo'

export const metadata = { title: 'Add target - Space Targets' }

const empty = { name: '', type: '', distanceLightYears: '', description: '' }

export default function NewTargetPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeading title="Add target" lead="Add a star, cluster or anything else worth pointing at." />
      {isReadOnly() ? <ReadOnlyNote /> : <TargetForm id={null} initial={empty} submitLabel="Add target" />}
    </div>
  )
}
