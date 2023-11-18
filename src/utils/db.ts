import { PrismaClient } from '@prisma/client';
// declare global {
//   namespace NodeJS {
//     interface Global {
//       prisma: PrismaClient;
//     }
//   }
// }
// if (global.prisma === undefined) {
//   global.prisma = new PrismaClient();
// }
// global.prisma = new PrismaClient();
// global.prisma.$connect();
// global.prisma.$disconnect();
const prisma = new PrismaClient();
export default prisma;
