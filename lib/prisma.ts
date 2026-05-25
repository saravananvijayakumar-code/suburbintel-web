import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// PERMANENT FIX: Proper connection pooling for Cloud Run
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  // Auto-disconnect on process termination
  if (typeof window === 'undefined') {
    process.on('beforeExit', async () => {
      await client.$disconnect()
    })
  }

  return client
}

// Singleton pattern - reuse connection across requests
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export helper for API routes that need explicit disconnect
export async function disconnectPrisma() {
  await prisma.$disconnect()
}

export default prisma

