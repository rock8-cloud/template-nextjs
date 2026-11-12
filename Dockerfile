# syntax=docker/dockerfile:1

FROM node:26-alpine AS base
WORKDIR /app

# All dependencies, used for the build
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Production dependencies. The final image needs them for the Prisma CLI,
# which applies migrations when the container starts. The packages removed
# here are build tools or are already part of the Next.js standalone output.
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force && \
    cd node_modules && \
    rm -rf next @next @img typescript @types caniuse-lite swagger-ui-dist \
      @fontsource-variable

# Build. The Prisma client is generated here, no database is needed.
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Run
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

# What the start step needs: production node_modules (Prisma CLI and driver),
# the Prisma config, schema, migrations, seed and the generated client.
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated
COPY --from=builder --chown=nextjs:nodejs /app/lib/prisma.ts /app/lib/seed-data.ts ./lib/
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# The Next.js standalone server, copied last so its traced files win
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Apply migrations and seed, then start the server
CMD ["sh", "-c", "node scripts/prestart.mjs && exec node server.js"]
