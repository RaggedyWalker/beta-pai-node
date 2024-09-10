import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// prisma.$use(async (params, next) => {
//   const before = Date.now();

//   const result = await next(params);

//   const after = Date.now();

//   console.log(
//     `Query ${params.model}.${params.action} took ${after - before}ms`
//   );

//   return result;
// });

export async function truncate(tableName: string) {
  await prisma.$executeRawUnsafe(`TRUNCATE ${tableName}`);
}

export default prisma;
