import { defineConfig } from 'prisma/config'

try {
  process.loadEnvFile()
} catch {
  // No .env file. The environment already has what we need.
}

// Some platforms add `uselibpqcompat=true` to DATABASE_URL. It is a
// node-postgres parameter that the Prisma CLI has no use for, so it is removed
// for migrations. The app itself (lib/prisma.ts) keeps the URL as it is.
function migrationUrl(url: string | undefined): string {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    parsed.searchParams.delete('uselibpqcompat')
    return parsed.toString()
  } catch {
    return url
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.ts',
  },
  datasource: {
    url: migrationUrl(process.env.DATABASE_URL),
  },
})
