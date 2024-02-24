import { Prisma } from '@prisma/client';

export default function PrismaErrorHandler(error: Prisma.PrismaClientKnownRequestError) {
  throw new Error(`Prisma: ${error.code}`);
}
