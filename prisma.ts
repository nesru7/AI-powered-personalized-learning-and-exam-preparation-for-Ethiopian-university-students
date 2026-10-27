/**
 * lib/prisma.ts
 *
 * Singleton PrismaClient using the global pattern to prevent multiple
 * instances during Next.js hot-reload in development.
 */
import { PrismaClient } from '@prisma/client';

// Extend the NodeJS global type to include the prisma singleton
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
