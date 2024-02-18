import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function truncate(tableName: string) {
  await prisma.$executeRawUnsafe(`TRUNCATE ${tableName}`);
}

export default prisma;
