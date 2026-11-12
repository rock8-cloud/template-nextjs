import { Prisma } from '../generated/prisma/client.ts'
import type { SpaceTarget } from '../generated/prisma/client.ts'
import { prisma } from './prisma.ts'
import type { TargetInput, TargetPatch } from './validation.ts'

export type { SpaceTarget }

export class NameTakenError extends Error {
  constructor(name: string) {
    super(`A target named "${name}" already exists.`)
  }
}

function isPrismaError(error: unknown, code: string) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
}

export function listTargets(): Promise<SpaceTarget[]> {
  return prisma.spaceTarget.findMany({ orderBy: { distanceLightYears: 'asc' } })
}

export function getTarget(id: number): Promise<SpaceTarget | null> {
  return prisma.spaceTarget.findUnique({ where: { id } })
}

export async function createTarget(data: TargetInput): Promise<SpaceTarget> {
  try {
    return await prisma.spaceTarget.create({ data })
  } catch (error) {
    if (isPrismaError(error, 'P2002')) throw new NameTakenError(data.name)
    throw error
  }
}

export async function updateTarget(id: number, data: TargetPatch): Promise<SpaceTarget | null> {
  try {
    return await prisma.spaceTarget.update({ where: { id }, data })
  } catch (error) {
    if (isPrismaError(error, 'P2025')) return null
    if (isPrismaError(error, 'P2002')) throw new NameTakenError(data.name ?? '')
    throw error
  }
}

export async function deleteTarget(id: number): Promise<boolean> {
  try {
    await prisma.spaceTarget.delete({ where: { id } })
    return true
  } catch (error) {
    if (isPrismaError(error, 'P2025')) return false
    throw error
  }
}

export async function pingDatabase(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`
}
