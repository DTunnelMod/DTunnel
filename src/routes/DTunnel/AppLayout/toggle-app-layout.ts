import { z } from 'zod';
import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import csrfProtection from '../../../middlewares/csrf-protection';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

const paramsSchema = z.object({
  id: z.string(),
});

export default {
  url: '/app_layout/toogle/:id',
  method: 'PUT',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const params = paramsSchema.parse(req.params);

    const id = parseInt(params.id);

    const getAppLayout = await SafeCallback(() =>
      prisma.appLayout.findFirst({
        where: {
          id,
          is_active: false,
          user_id: req.user.id,
        },
      })
    );

    if (!getAppLayout) {
      reply.status(400);
      throw new Error('Nenhum layout foi encontrado');
    }

    const result = await SafeCallback(async () => {
      await prisma.appLayout.updateMany({
        where: {
          is_active: true,
          user_id: req.user.id,
        },
        data: {
          is_active: false,
        },
      });

      return await prisma.appLayout.update({
        where: {
          id: getAppLayout.id,
        },
        data: {
          is_active: true,
        },
      });
    });

    if (!result) {
      throw new Error('Não foi possível ativar o layout');
    }

    reply.header('csrf-token', req.csrfProtection.generateCsrf());

    reply.send({});
  },
} as RouteOptions;
