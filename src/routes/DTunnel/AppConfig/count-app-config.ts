import prisma from '../../../config/prisma-client';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

export default {
  url: '/config_count',
  method: 'GET',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const total_configs = await prisma.appConfig.count({
      where: { user_id: req.user.id },
    });

    const total_categories = await prisma.category.count({
      where: { user_id: req.user.id },
    });

    reply.send({
      total_categories,
      total_configs,
    });
  },
} as RouteOptions;
