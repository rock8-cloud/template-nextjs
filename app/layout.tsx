import type { Metadata } from 'next'
import Link from 'next/link'
import { isReadOnly } from '@/lib/demo'
import './globals.css'

export const metadata: Metadata = {
  title: 'Space Targets',
  description: 'A small Next.js, Prisma and PostgreSQL app with a REST API.',
}

export const dynamic = 'force-dynamic'

function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 text-accent" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(-28 12 12)" />
    </svg>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const readOnly = isReadOnly()

  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-line">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
              <Mark />
              Space Targets
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              {readOnly && (
                <span className="mr-2 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  Read-only demo
                </span>
              )}
              <Link href="/" className="btn btn-quiet">
                Targets
              </Link>
              <Link href="/swagger" className="btn btn-quiet">
                API docs
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  )
}
