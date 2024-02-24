import { categorySchema } from './zod-schema';
import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

export default {
  url: '/category',
  method: 'POST',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const { name, color, status, sorter } = categorySchema.parse(req.body);

    const category = await SafeCallback(() =>
      prisma.category.create({
        data: {
          name,
          color: color.toUpperCase(),
          status,
          sorter: parseInt(String(sorter)),
          user_id: req.user.id,
        },
      })
    );

    if (!category) {
      throw new Error('Não foi possível criar categoria');
    }

    reply.status(201).send({ category_id: category.id });
  },
} as RouteOptions;
