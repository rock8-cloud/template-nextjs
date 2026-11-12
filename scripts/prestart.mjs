// Runs before the server starts: waits for the database, applies pending
// Prisma migrations and seeds the table when it is empty. Safe on every start.
import { spawnSync } from 'node:child_process'

const PRISMA_CLI = 'node_modules/prisma/build/index.js'
const WAIT_LIMIT_MS = 60_000
const RETRY_DELAY_MS = 2_000
const CONNECTION_ERROR =
  /P1000|P1001|P1002|P1017|ECONNREFUSED|ECONNRESET|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|the database system is starting up|Can't reach database server/

function prisma(...args) {
  const result = spawnSync(process.execPath, [PRISMA_CLI, ...args], {
    encoding: 'utf8',
    env: { ...process.env, PRISMA_HIDE_UPDATE_MESSAGE: 'true', CHECKPOINT_DISABLE: '1' },
  })
  return { ok: result.status === 0, output: `${result.stdout ?? ''}${result.stderr ?? ''}` }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const startedAt = Date.now()
for (;;) {
  const migrate = prisma('migrate', 'deploy')
  if (migrate.ok) {
    console.log(migrate.output.trim())
    break
  }
  const waited = Date.now() - startedAt
  if (!CONNECTION_ERROR.test(migrate.output) || waited + RETRY_DELAY_MS > WAIT_LIMIT_MS) {
    console.error(migrate.output.trim())
    console.error('Migrations failed, the server will not start.')
    process.exit(1)
  }
  console.log(`Database is not ready yet, retrying (${Math.round(waited / 1000)}s)...`)
  await sleep(RETRY_DELAY_MS)
}

const seed = prisma('db', 'seed')
console.log(seed.output.trim())
if (!seed.ok) {
  console.error('Seeding failed, the server will not start.')
  process.exit(1)
}
