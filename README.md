# Space Targets

![Space Targets](./app-demo.png)

A small starter app built with Next.js, Prisma and PostgreSQL. It has a web UI, a REST API and Swagger docs. Use it as a base for your own app.

- **Next.js** App Router with server components and server actions
- **Prisma** for the database, with migrations and a seed
- **REST API** with validation and JSON errors
- **Swagger UI** generated from an OpenAPI spec
- **Tailwind CSS** for styling
- **Docker** image that applies migrations when it starts

## Routes

| Path | What it does |
| --- | --- |
| `/` | List of targets with add, edit and delete |
| `/targets/new` | Form to add a target |
| `/targets/{id}/edit` | Form to edit a target |
| `/swagger` | Swagger UI for the API |

## API

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/api/targets` | List all targets |
| `POST` | `/api/targets` | Create a target |
| `GET` | `/api/targets/{id}` | Get one target |
| `PATCH` | `/api/targets/{id}` | Update a target |
| `DELETE` | `/api/targets/{id}` | Delete a target |
| `GET` | `/api/health` | Check the app and the database |
| `GET` | `/api/openapi.json` | The OpenAPI spec |

Errors come back as JSON with a fitting status code: `400` for invalid input, `403` in read-only mode, `404` for an unknown id and `409` for a name that is already taken.

```bash
curl -X POST http://localhost:3000/api/targets \
  -H 'content-type: application/json' \
  -d '{"name":"Betelgeuse","type":"Red supergiant","distanceLightYears":548}'
```

## Run it locally

### With Docker Compose

```bash
docker compose up --build
```

This starts PostgreSQL and the app. Open http://localhost:3000. Set `APP_PORT` or `DB_PORT` if the default ports are taken, for example `APP_PORT=3001 docker compose up --build`.

### With npm against a local PostgreSQL

You need Node.js 22.18 or newer and a running PostgreSQL. The one from Docker Compose works well:

```bash
docker compose up -d db
cp .env.example .env
npm install
npm run db:deploy
npm run dev
```

`npm run db:deploy` applies the migrations and seeds the table when it is empty. Open http://localhost:3000.

## Environment variables

| Name | Required | What it does |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string, for example `postgres://user:pass@host:5432/dbname` |
| `DEMO_READ_ONLY` | no | Set to `true` to refuse every write. The default is off. |

### Read-only demo mode

With `DEMO_READ_ONLY=true` the app refuses every change. The API answers `POST`, `PATCH` and `DELETE` with `403`, the server actions return a message, and the UI hides the edit controls and shows a short note. Reading still works. This lets you run a public demo safely.

## Change the database schema

1. Edit `prisma/schema.prisma`.
2. Create a migration: `npm run db:migrate -- --name what_changed`. This writes a new folder to `prisma/migrations/` and applies it to your local database.
3. Commit the migration and push.

The Prisma client is generated again on `npm run dev` and `npm run build`. Run `npm run db:generate` to do it by hand.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate the Prisma client and build the app |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without output |
| `npm run db:migrate` | Create and apply a migration in development |
| `npm run db:deploy` | Apply pending migrations and seed an empty table |
| `npm run db:seed` | Run the seed only |

## Deploy on Rock8Cloud

Rock8Cloud builds the `Dockerfile`, creates a managed PostgreSQL and sets `DATABASE_URL` for you. There is nothing else to configure.

- A push to `main` builds and deploys a new version.
- Each time the container starts it waits for the database (up to about 60 seconds), applies pending migrations and seeds the table when it is empty. Only then does the server start.
- The app listens on port 3000.

## Project layout

```
app/                 pages, server actions and API routes
components/          shared React components
lib/                 Prisma client, queries, validation, OpenAPI spec
prisma/              schema, migrations and seed
scripts/prestart.mjs waits for the database, migrates and seeds
```

See `AGENTS.md` for the conventions to keep when you extend the app.
