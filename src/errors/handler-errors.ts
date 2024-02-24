import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import ZodErrorHandler from './zod-error';
import PrismaErrorHandler from './prisma-error';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export default function HandlerErrors(error: FastifyError, req: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    reply.status(400);
    ZodErrorHandler(error);
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    PrismaErrorHandler(error);
  }
  reply.send(error);
}
