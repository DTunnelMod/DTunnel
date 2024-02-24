import { z } from 'zod';
import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

const paramsSchema = z.object({
  id: z.string(),
});

export default {
  url: '/app_layout/delete/:id',
  method: 'DELETE',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const params = paramsSchema.parse(req.params);

    const id = parseInt(params.id);

    const deleteAppLayout = await SafeCallback(() =>
      prisma.appLayout.delete({
        where: {
          id,
          is_active: false,
          user_id: req.user.id,
        },
      })
    );

    if (!deleteAppLayout) {
      reply.status(400);
      throw new Error('Não foi possível apagar layout');
    }

    reply.status(204).send();
  },
} as RouteOptions;
