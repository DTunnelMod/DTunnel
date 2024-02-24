import { z } from 'zod';
import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { categorySchema } from './zod-schema';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

const paramsSchema = z.object({
  id: z.string(),
});

export default {
  url: '/category/:id',
  method: 'PUT',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const params = paramsSchema.parse(req.params);

    const id = parseInt(params.id);
    const { name, color, status, sorter } = categorySchema.parse(req.body);

    const category = await SafeCallback(() =>
      prisma.category.update({
        where: {
          id,
          user_id: req.user.id,
        },
        data: {
          name,
          color: color.toUpperCase(),
          status,
          sorter: parseInt(String(sorter)),
        },
      })
    );

    if (!category) {
      reply.status(400);
      throw new Error('Não foi possível editar essa categoria');
    }

    reply.send({ status: 200 });
  },
} as RouteOptions;
