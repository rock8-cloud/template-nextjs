export async function register() {
  // Run only in Node.js runtime, not in Edge runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { migrate } = await import('./lib/migrate')
    await migrate()
  }
}
