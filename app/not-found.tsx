import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Nothing at these coordinates</h1>
      <p className="mt-2 text-sm text-muted">The page or target you are looking for does not exist.</p>
      <Link href="/" className="btn mt-6">
        Back to targets
      </Link>
    </div>
  )
}
