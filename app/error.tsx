'use client'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">
        The app could not load this page. The database may be unreachable. Check /api/health and try
        again.
      </p>
      <button type="button" onClick={reset} className="btn mt-6">
        Try again
      </button>
    </div>
  )
}
