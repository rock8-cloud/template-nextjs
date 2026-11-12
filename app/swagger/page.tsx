import { PageHeading } from '@/components/page-heading'
import { SwaggerUi } from '@/components/swagger-ui'

export const metadata = { title: 'API docs - Space Targets' }

export default function SwaggerPage() {
  return (
    <>
      <PageHeading title="API docs" lead="Every endpoint of the REST API. The spec is at /api/openapi.json." />
      <SwaggerUi url="/api/openapi.json" />
    </>
  )
}
