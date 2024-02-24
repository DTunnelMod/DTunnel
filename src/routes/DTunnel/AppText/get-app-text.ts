import prisma from '../../../config/prisma-client';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

export default {
  url: '/texts_list',
  method: 'GET',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const texts = await prisma.appText.findMany({
      where: { user_id: req.user.id },
      select: {
        id: true,
        label: true,
        text: true,
      },
    });

    reply.send({ data: texts, user_id: req.user.id });
  },
} as RouteOptions;
