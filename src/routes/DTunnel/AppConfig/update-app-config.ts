import { z } from 'zod';
import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { AppConfigSchema, getDateCreateAppConfig } from './zod-schema';

const paramsSchema = z.object({
  id: z.string(),
});

export default {
  url: '/config/:id',
  method: 'PUT',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const params = paramsSchema.parse(req.params);

    const id = parseInt(params.id);
    const body = AppConfigSchema.parse(req.body);

    const configAlreadyExists = await SafeCallback(() =>
      prisma.appConfig.findFirst({
        where: { id, user_id: req.user.id },
      })
    );

    if (!configAlreadyExists) {
      reply.status(400);
      throw new Error('Configuração não encontrada');
    }

    const config = await SafeCallback(() =>
      prisma.appConfig.update({
        where: { id, user_id: req.user.id },
        data: {
          category_id: body.category_id,
          ...getDateCreateAppConfig(body),
          user_id: req.user.id,
        },
      })
    );

    if (!config) {
      throw new Error('Não possivel foi editar a configuração');
    }

    reply.send({ status: 200 });
  },
} as RouteOptions;
