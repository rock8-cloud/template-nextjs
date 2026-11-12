'use client'

import { useEffect, useRef } from 'react'
import 'swagger-ui-dist/swagger-ui.css'

export function SwaggerUi({ url }: { url: string }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    import('swagger-ui-dist/swagger-ui-es-bundle.js').then(({ default: SwaggerUIBundle }) => {
      if (active && container.current) SwaggerUIBundle({ url, domNode: container.current })
    })
    return () => {
      active = false
    }
  }, [url])

  return <div ref={container} className="min-h-96 rounded-lg bg-white py-2 text-black [color-scheme:light]" />
}
