# Agent notes

A Next.js (App Router) app with Prisma, PostgreSQL, a REST API and Swagger. Use npm.

## Layout

- `app/` - pages and route handlers. `app/page.tsx` is the list, `app/targets/` holds the add and edit screens, `app/actions.ts` holds the server actions, `app/api/` holds the REST API.
- `components/` - shared React components. Client components start with `'use client'`.
- `lib/prisma.ts` - the one Prisma client.
- `lib/targets.ts` - every database query. Pages, actions and API routes call these functions.
- `lib/validation.ts` - zod schemas shared by the UI and the API.
- `lib/openapi.ts` - the OpenAPI spec served at `/api/openapi.json` and shown at `/swagger`.
- `lib/demo.ts` - the `DEMO_READ_ONLY` switch.
- `prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.ts` - schema, migrations and seed.
- `prisma.config.ts` - Prisma CLI config.
- `scripts/prestart.mjs` - runs in the container before the server: waits for the database, applies migrations, seeds an empty table.
- `generated/` - the generated Prisma client. Never edit or commit it.

## Conventions to keep

- All database access goes through Prisma, in `lib/`. Do not query the database from pages, components or route handlers directly. Add a function to `lib/targets.ts` (or a new file next to it) and call that.
- Every schema change needs a migration. Edit `prisma/schema.prisma`, run `npm run db:migrate -- --name what_changed` and commit the new folder in `prisma/migrations/`. Never edit a migration that was already pushed.
- Keep the seed safe to run on every start. It must only insert when the table is empty.
- Validate all input with the zod schemas in `lib/validation.ts`, in server actions and in API routes.
- Every write path (server action or POST, PATCH, DELETE route) must check `isReadOnly()` first.
- When you add or change an API route, update `lib/openapi.ts` in the same change. Keep the Swagger page at `/swagger`.
- Import the generated client with a relative path and the `.ts` extension inside `lib/` and `prisma/`. The seed runs with plain Node, which needs both.
- `DATABASE_URL` is the only required environment variable. Do not add another required one without a default.
- Keep the Dockerfile contract: standalone output, port 3000, non-root user, migrations on start.

## Before you finish

Run `npm run lint`, `npm run typecheck` and `npm run build`.
