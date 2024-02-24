import { z } from 'zod';
import prisma from '../../../config/prisma-client';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { AppLayoutParser } from '../../../utils/parsers/app-layout-parser';

const querySchema = z.object({
  offset: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});

export default {
  url: '/app_layout/list',
  method: 'GET',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const query = querySchema.parse(req.query);

    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    const total = await prisma.appLayout.count({
      where: { user_id: req.user.id },
    });

    const appLayouts = AppLayoutParser(
      await prisma.appLayout.findMany({
        where: { user_id: req.user.id },
        select: {
          id: true,
          user_id: true,
          is_active: true,
          layout_storage: {
            select: {
              id: true,
              label: true,
              name: true,
              status: true,
              type: true,
              value: true,
            },
          },
        },
        skip: (offset - 1) * limit,
        take: limit,
      })
    );

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

    response.data.total = total;
    response.data.count = appLayouts.length;
    response.data.result = appLayouts;

    reply.send(response);
  },
} as RouteOptions;
