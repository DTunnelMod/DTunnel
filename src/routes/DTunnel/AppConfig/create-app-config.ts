import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { AppConfigSchema, getDateCreateAppConfig } from './zod-schema';

export default {
  url: '/config',
  method: 'POST',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const body = AppConfigSchema.parse(req.body);

    const config = await SafeCallback(() =>
      prisma.appConfig.create({
        data: {
          ...getDateCreateAppConfig(body),
          category_id: body.category_id!,
          user_id: req.user.id,
        },
      })
    );

    if (!config) {
      throw new Error('Não foi possível criar a configuração');
    }

    reply.status(201).send({ status: 201, config_id: config.id });
  },
} as RouteOptions;
