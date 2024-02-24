import { z } from 'zod';
import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

const paramsSchema = z.object({
  id: z.string(),
});

export default {
  url: '/category/:id',
  method: 'DELETE',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const params = paramsSchema.parse(req.params);
    const id = Number(params.id);

    const category = await SafeCallback(() =>
      prisma.category.deleteMany({
        where: {
          id,
          user_id: req.user.id,
        },
      })
    );

    if (!category) {
      reply.status(400);
      throw new Error('Não foi possível deletar categoria');
    }

    reply.status(204).send();
  },
} as RouteOptions;
