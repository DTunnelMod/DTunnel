import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { AppLayoutUpdate } from './zod-schema';

export default {
  url: '/app_layout/update',
  method: 'PUT',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const body = AppLayoutUpdate.parse(req.body);
    let app_layout_id = body.id;

    if (!app_layout_id) {
      const getAppLayoutActive = await prisma.appLayout.findFirst({
        where: {
          is_active: true,
          user_id: req.user.id,
        },
      });

      if (!getAppLayoutActive) {
        throw new Error('Não foi possível obter layout');
      }

      app_layout_id = getAppLayoutActive.id;
    }

    for await (const AppLayout of body.app_config) {
      const value =
        typeof AppLayout.value === 'object' && AppLayout.type == 'SELECT' ? AppLayout.value?.selected : AppLayout.value;

      await SafeCallback(() =>
        prisma.appLayoutStorage.update({
          where: {
            app_layout_id: app_layout_id!,
            id: AppLayout.id!,
          },
          data: {
            value: String(value) == 'null' ? null : String(value),
          },
        })
      );
    }

    reply.send({});
  },
} as RouteOptions;
