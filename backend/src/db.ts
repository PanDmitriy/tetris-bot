import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Graceful shutdown
process.once('SIGINT', async () => {
  await prisma.$disconnect();
});

process.once('SIGTERM', async () => {
  await prisma.$disconnect();
});



