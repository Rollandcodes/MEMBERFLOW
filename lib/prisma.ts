import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
    const configuredUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL
    const isProduction = process.env.NODE_ENV === 'production'

    if (!configuredUrl && isProduction) {
        throw new Error('Missing DATABASE_URL/TURSO_DATABASE_URL in production environment')
    }

    // Development fallback prevents local startup/build crashes when env vars are missing.
    const url = configuredUrl || 'file:./dev.db'
    const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN

    const libsql = createClient({
        url: url,
        authToken: authToken,
    })
    const adapter = new PrismaLibSQL(libsql)
    return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
