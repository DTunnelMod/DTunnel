import { z } from 'zod';
import prisma from '../../../config/prisma-client';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

const querySchema = z.object({
  offset: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});

export default {
  url: '/category_list',
  method: 'GET',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const query = querySchema.parse(req.query);

    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    const response = {
      status: 200,
      data: {
        total: 0,
        count: 0,
        limit,
        offset,
        result: [],
      },
    } as any;

    const total = await prisma.category.count({
      where: { user_id: req.user.id },
    });

    const categories = await prisma.category.findMany({
      where: {
        user_id: req.user.id,
      },
      skip: (offset - 1) * limit,
      take: limit,
    });

    response.data.total = total;
    response.data.count = categories.length;
    response.data.result = categories;

    reply.send(response);
  },
} as RouteOptions;
