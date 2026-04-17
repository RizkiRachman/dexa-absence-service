import { PrismaClient } from '.prisma/logging-client';

// Extend the global type so TypeScript knows about our cached logging client
const globalForPrisma = globalThis as unknown as {
  loggingPrisma: PrismaClient | undefined;
};

const loggingPrisma =
  globalForPrisma.loggingPrisma ??
  new PrismaClient({
    log: ['error'],
  });

globalForPrisma.loggingPrisma = loggingPrisma;

export default loggingPrisma;
