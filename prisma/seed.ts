import { prisma } from '../lib/prisma.ts'
import { seedTargets } from '../lib/seed-data.ts'

try {
  const count = await prisma.spaceTarget.count()
  if (count > 0) {
    console.log(`Seed skipped, the table already has ${count} rows.`)
  } else {
    await prisma.spaceTarget.createMany({ data: seedTargets, skipDuplicates: true })
    console.log(`Seeded ${seedTargets.length} space targets.`)
  }
} finally {
  await prisma.$disconnect()
}
