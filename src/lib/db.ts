import { PrismaClient } from '@prisma/client';

// Extend the global type so TypeScript knows about our cached client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error'],
  });
globalForPrisma.prisma = prisma;

export default prisma;
